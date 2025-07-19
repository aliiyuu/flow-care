import { useCallback, useEffect, useRef } from 'react';
import { useOCRStore } from './useOCRStore';

interface OCRStatusResponse {
  status: string;
  result: string | null;
  progress: number;
}

export const useOCRPersistent = () => {
  const store = useOCRStore();
  
  // Use ref to persist polling state across re-renders and navigation
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef<boolean>(false);

  // Resume polling if there's an active document being processed
  useEffect(() => {
    if (store.documentId && store.isProcessing && !isPollingRef.current) {
      console.log('Resuming OCR polling for document:', store.documentId);
      const statusPath = '/api/ocr/status';
      pollStatus(store.documentId, statusPath);
    }
    
    // Cleanup on unmount
    return () => {
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
        pollingRef.current = null;
      }
      isPollingRef.current = false;
    };
  }, [store.documentId, store.isProcessing]);

  const uploadImage = useCallback(async (file: File, apiPath: string = '/api/ocr/upload') => {
    // Store file information
    store.setFileInfo(file.name, file.size, file.type);
    store.setUploading(true);
    store.setError(null);
    store.setResult(null);
    store.setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate upload progress for better UX
      store.setProgress(25);

      const response = await fetch(apiPath, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      store.setUploading(false);
      store.setProcessing(true);
      store.setDocumentId(data.documentId);
      store.setProgress(30); // Show some initial progress

      // Start polling for status
      const statusPath = '/api/ocr/status';
      pollStatus(data.documentId, statusPath);

    } catch (error) {
      store.setUploading(false);
      store.setProcessing(false);
      store.setError((error as Error).message);
      store.setProgress(0);
    }
  }, [store]);

  const pollStatus = useCallback(async (documentId: string, statusPath: string = '/api/ocr/status') => {
    // Prevent multiple polling instances
    if (isPollingRef.current) {
      return;
    }
    
    isPollingRef.current = true;
    const maxAttempts = 120; // 120 attempts with 2-second intervals = 4 minutes max
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        store.setProcessing(false);
        store.setError('Processing timeout. Please try again.');
        isPollingRef.current = false;
        return;
      }

      try {
        const response = await fetch(`${statusPath}?documentId=${documentId}`);
        const data: OCRStatusResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.result || 'Status check failed');
        }

        console.log('OCR Status Response:', data); // Debug log

        // Update progress - ensure it's a valid number
        const progressValue = typeof data.progress === 'number' ? data.progress : 0;
        
        store.setProgress(Math.max(progressValue, store.progress)); // Ensure progress never goes backwards

        if (data.status === 'completed') {
          store.setProcessing(false);
          store.setResult(data.result);
          store.setProgress(100);
          isPollingRef.current = false;
        } else if (data.status === 'failed') {
          store.setProcessing(false);
          store.setError('OCR processing failed');
          isPollingRef.current = false;
        } else {
          // Continue polling
          attempts++;
          
          // Use timeout ref to allow cleanup
          pollingRef.current = setTimeout(poll, 2000);
        }
      } catch (error) {
        store.setProcessing(false);
        store.setError((error as Error).message);
        isPollingRef.current = false;
      }
    };

    poll();
  }, [store]);

  const reset = useCallback(() => {
    // Clear any active polling
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
    isPollingRef.current = false;
    
    store.reset();
  }, [store]);

  return {
    // State from store
    isUploading: store.isUploading,
    isProcessing: store.isProcessing,
    progress: store.progress,
    documentId: store.documentId,
    result: store.result,
    error: store.error,
    fileName: store.fileName,
    fileSize: store.fileSize,
    fileType: store.fileType,
    
    // Actions
    uploadImage,
    reset,
  };
};
