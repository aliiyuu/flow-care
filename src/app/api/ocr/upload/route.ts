import { NextRequest, NextResponse } from 'next/server';

const HOCR_API_KEY = process.env.HOCR;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Add logging for file details
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Better filename and content type handling
    let filename = file.name || 'image.jpg';
    let contentType = file.type || 'image/jpeg';
    
    // Handle iOS HEIC files
    if (file.name && file.name.toLowerCase().endsWith('.heic')) {
      contentType = 'image/heic';
    }
    if (file.name && file.name.toLowerCase().endsWith('.heif')) {
      contentType = 'image/heif';
    }
    
    console.log('Processed file info:', { filename, contentType, bufferSize: buffer.length });
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', new Blob([buffer], { type: contentType }), filename);
    uploadFormData.append('action', 'transcribe');
    uploadFormData.append('delete_after', '604800');
    
    console.log("Sending to HandwritingOCR API...");
    
    const uploadRes = await fetch('https://www.handwritingocr.com/api/v3/documents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HOCR_API_KEY}`,
      },
      body: uploadFormData
    });
    
    const responseText = await uploadRes.text();
    console.log('HandwritingOCR response:', responseText);
    
    if (!uploadRes.ok) {
      console.error('HandwritingOCR upload error:', responseText);
      return NextResponse.json({ 
        error: 'Failed to upload image', 
        details: responseText 
      }, { status: 500 });
    }
    
    let uploadData;
    try {
      uploadData = JSON.parse(responseText);
    } catch (err) {
      console.error('Error parsing JSON response:', err);
      
      // Check if we got an HTML login page (indicates auth issue)
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        return NextResponse.json({ 
          error: 'Authentication failed - please check your HOCR API key in environment variables',
          details: 'Received HTML login page instead of JSON response'
        }, { status: 401 });
      }
      
      return NextResponse.json({ 
        error: 'Invalid response from OCR service',
        response: responseText.substring(0, 500) // Limit response size
      }, { status: 500 });
    }
    
    console.log('Upload successful, document ID:', uploadData.id);
    
    // Return the document ID immediately - no polling here
    return NextResponse.json({ 
      documentId: uploadData.id,
      message: 'Document uploaded successfully. Use /api/ocr/status to check processing status.'
    });
    
  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json({ 
      error: (err as Error).message || 'Unknown error occurred',
      stack: process.env.NODE_ENV === 'development' ? (err as Error).stack : undefined
    }, { status: 500 });
  }
}
