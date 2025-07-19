'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useOCRPersistent } from '../../hooks/useOCRPersistent';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function ImageScannerPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const {
    isUploading,
    isProcessing,
    progress,
    result,
    error,
    fileName,
    fileSize,
    fileType,
    uploadImage,
    reset,
  } = useOCRPersistent();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Clean up previous preview URL if it exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Create new preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Check if we have persistent file info without a local file (after navigation)
  const hasPersistedFile = fileName && !selectedFile;
  const displayFileName = selectedFile?.name || fileName;
  const displayFileSize = selectedFile?.size || fileSize;
  const displayFileType = selectedFile?.type || fileType;

  const handleUpload = async () => {
    if (selectedFile) {
      const apiPath = '/api/ocr/upload';
      await uploadImage(selectedFile, apiPath);
    }   
  };

  const handleReset = () => {
    reset();
    setSelectedFile(null);
    
    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        
        // Clean up previous preview URL if it exists
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Medical Document Scanner
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Upload handwritten medical notes and prescriptions for digital transcription
          </p>
          
        
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <Card
            title="Upload Medical Document"
            content={
              <div className="space-y-6">
                {/* Drag and Drop Area */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors"
                >
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img
                        src={previewUrl}
                        alt="Selected file preview"
                        className="max-h-64 mx-auto rounded-lg shadow-sm"
                      />
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{displayFileName}</p>
                        <p>{displayFileSize && formatFileSize(displayFileSize)}</p>
                        <p>{displayFileType}</p>
                      </div>
                    </div>
                  ) : hasPersistedFile ? (
                    <div className="space-y-4">
                      <div className="text-6xl text-gray-400">📄</div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium text-gray-900">Previously uploaded: {displayFileName}</p>
                        <p>{displayFileSize && formatFileSize(displayFileSize)}</p>
                        <p>{displayFileType}</p>
                        <p className="text-xs text-teal-600 mt-2">
                          Processing state preserved across navigation
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-6xl text-gray-400">📄</div>
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          Drop your medical document here
                        </p>
                        <p className="text-sm text-gray-500">
                          or click to browse files
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Supports JPG, PNG, HEIC, HEIF formats
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="mt-4"
                    disabled={isUploading || isProcessing}
                  >
                    Choose File
                  </Button>
                </div>

                {/* File Info and Actions */}
                {(selectedFile || hasPersistedFile) && (
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">📎</div>
                      <div>
                        <p className="font-medium text-gray-900">{displayFileName}</p>
                        <p className="text-sm text-gray-500">
                          {displayFileSize && formatFileSize(displayFileSize)} • {displayFileType}
                          {hasPersistedFile && (
                            <span className="text-teal-600 ml-2">(Restored from previous session)</span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {selectedFile && (
                        <Button
                          onClick={handleUpload}
                          disabled={isUploading || isProcessing}
                          variant="primary"
                        >
                          {isUploading ? 'Uploading...' : 'Scan Document'}
                        </Button>
                      )}
                      <Button
                        onClick={handleReset}
                        disabled={isUploading || isProcessing}
                        variant="outline"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            }
          />
        </div>

        {/* Progress Section */}
        {(isUploading || isProcessing) && (
          <div className="mb-8">
            <Card
              title="Processing Status"
              content={
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                            <span className="text-sm text-gray-600">Uploading file...</span>
                            <span className="text-xs text-gray-500">({progress}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-teal-600 h-2 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${Math.max(progress, 10)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500">Sending to OCR service...</p>
                        </div>
                      )}
                      {isProcessing && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="animate-pulse rounded-full h-4 w-4 bg-teal-600"></div>
                            <span className="text-sm text-gray-600">Processing OCR...</span>
                            <span className="text-xs text-gray-500">({progress}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-teal-600 h-2 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${Math.max(progress, 5)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">{progress}% complete</p>
                            {progress === 0 && (
                              <p className="text-xs text-gray-400">Initializing...</p>
                            )}
                            {progress > 0 && progress < 100 && (
                              <p className="text-xs text-gray-400">Processing document...</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        )}

        {/* Error Section */}
        {error && (
          <div className="mb-8">
            <Card
              content={
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600 text-xl">⚠️</span>
                    <div>
                      <h3 className="font-medium text-red-800">Error Processing Document</h3>
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="mb-8">
            <Card
              title="Transcribed Text"
              content={
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-green-600 text-xl">✅</span>
                      <h3 className="font-medium text-green-800">OCR Processing Complete</h3>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Extracted Text:</h4>
                    <div className="bg-white border rounded p-4 max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                        {result}
                      </pre>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => navigator.clipboard.writeText(result)}
                      variant="outline"
                    >
                      Copy Text
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="primary"
                    >
                      Scan Another Document
                    </Button>
                  </div>
                </div>
              }
            />
          </div>
        )}

        {/* Instructions Section */}
        <Card
          title="Usage Instructions"
          content={
            <div className="space-y-4 text-sm text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">📱 Best Practices:</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Ensure good lighting when photographing documents</li>
                    <li>Keep the document flat and avoid shadows</li>
                    <li>Capture the entire document in frame</li>
                    <li>Use high resolution for better OCR accuracy</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🏥 Medical Use:</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Digitize handwritten patient notes</li>
                    <li>Convert prescription documents to text</li>
                    <li>Archive medical records electronically</li>
                    <li>Enable searchable medical documentation</li>
                  </ul>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
