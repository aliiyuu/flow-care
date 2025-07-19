import { useState, useCallback, useRef } from 'react';

interface OCRUploadState {
  isUploading: boolean;
  isProcessing: boolean;
  progress: number;
  documentId: string | null;
  result: string | null;
  error: string | null;
}

interface OCRStatusResponse {
  status: string;
  result: string | null;
  progress: number;
}

export const useOCR = () => {
  const [state, setState] = useState<OCRUploadState>({
    isUploading: false,
    isProcessing: false,
    progress: 0,
    documentId: null,
    result: null,
    error: null,
  });

  // Use ref to persist polling state across re-renders and tab changes
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef<boolean>(false);

  const uploadImage = useCallback(async (file: File, apiPath: string = '/api/ocr/upload') => {
    setState(prev => ({
      ...prev,
      isUploading: true,
      error: null,
      result: null,
      progress: 0,
    }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate upload progress for better UX
      setState(prev => ({ ...prev, progress: 25 }));

      const response = await fetch(apiPath, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setState(prev => ({
        ...prev,
        isUploading: false,
        isProcessing: true,
        documentId: data.documentId,
        progress: 30, // Show some initial progress
      }));

      // Start polling for status
      const statusPath = apiPath.includes('/demo/') ? '/api/ocr/demo/status' : '/api/ocr/status';
      pollStatus(data.documentId, statusPath);

    } catch (error) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        isProcessing: false,
        error: (error as Error).message,
        progress: 0,
      }));
    }
  }, []);

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
        setState(prev => ({
          ...prev,
          isProcessing: false,
          error: 'Processing timeout. Please try again.',
        }));
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
        
        setState(prev => ({
          ...prev,
          progress: Math.max(progressValue, prev.progress), // Ensure progress never goes backwards
        }));

        if (data.status === 'completed') {
          setState(prev => ({
            ...prev,
            isProcessing: false,
            result: data.result,
            progress: 100,
          }));
          isPollingRef.current = false;
        } else if (data.status === 'failed') {
          setState(prev => ({
            ...prev,
            isProcessing: false,
            error: 'OCR processing failed',
          }));
          isPollingRef.current = false;
        } else {
          // Continue polling
          attempts++;
          
          // Use timeout ref to allow cleanup
          pollingRef.current = setTimeout(poll, 2000);
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          isProcessing: false,
          error: (error as Error).message,
        }));
        isPollingRef.current = false;
      }
    };

    poll();
  }, []);

  const reset = useCallback(() => {
    // Clear any active polling
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
    isPollingRef.current = false;
    
    setState({
      isUploading: false,
      isProcessing: false,
      progress: 0,
      documentId: null,
      result: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    uploadImage,
    reset,
  };
};
