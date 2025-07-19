import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OCRState {
  // Current processing state
  isUploading: boolean;
  isProcessing: boolean;
  progress: number;
  documentId: string | null;
  result: string | null;
  error: string | null;
  
  // File information
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  
 
  
  // Actions
  setUploading: (uploading: boolean) => void;
  setProcessing: (processing: boolean) => void;
  setProgress: (progress: number) => void;
  setDocumentId: (id: string | null) => void;
  setResult: (result: string | null) => void;
  setError: (error: string | null) => void;
  setFileInfo: (name: string | null, size: number | null, type: string | null) => void;
  reset: () => void;
}

export const useOCRStore = create<OCRState>()(
  persist(
    (set, get) => ({
      // Initial state
      isUploading: false,
      isProcessing: false,
      progress: 0,
      documentId: null,
      result: null,
      error: null,
      fileName: null,
      fileSize: null,
      fileType: null,
      
      
      // Actions
      setUploading: (uploading: boolean) => set({ isUploading: uploading }),
      setProcessing: (processing: boolean) => set({ isProcessing: processing }),
      setProgress: (progress: number) => set({ progress }),
      setDocumentId: (id: string | null) => set({ documentId: id }),
      setResult: (result: string | null) => set({ result }),
      setError: (error: string | null) => set({ error }),
      setFileInfo: (name: string | null, size: number | null, type: string | null) => set({ 
        fileName: name, 
        fileSize: size, 
        fileType: type 
      }),
      reset: () => set({
        isUploading: false,
        isProcessing: false,
        progress: 0,
        documentId: null,
        result: null,
        error: null,
        fileName: null,
        fileSize: null,
        fileType: null,
      }),
    }),
    {
      name: 'ocr-storage', // Storage key
      partialize: (state: OCRState) => ({
        // Only persist these fields
        progress: state.progress,
        documentId: state.documentId,
        result: state.result,
        error: state.error,
        fileName: state.fileName,
        fileSize: state.fileSize,
        fileType: state.fileType,
        isProcessing: state.isProcessing,
      }),
    }
  )
);
