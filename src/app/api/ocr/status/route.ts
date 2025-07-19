import { NextRequest, NextResponse } from 'next/server';

const HOCR_API_KEY = process.env.HOCR;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('documentId');
    
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    console.log('Checking status for document ID:', documentId);
    
    const statusRes = await fetch(`https://www.handwritingocr.com/api/v3/documents/${documentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${HOCR_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    const responseText = await statusRes.text();
    console.log('HandwritingOCR status response:', responseText);
    
    if (!statusRes.ok) {
      console.error('HandwritingOCR status error:', responseText);
      return NextResponse.json({ 
        error: 'Failed to check document status', 
        details: responseText 
      }, { status: 500 });
    }
    
    let statusData;
    try {
      statusData = JSON.parse(responseText);
    } catch (err) {
      console.error('Error parsing JSON response:', err);
      
      // Check if we got an HTML login page (indicates auth issue)
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        return NextResponse.json({ 
          error: 'Authentication failed - please check your HOCR API key',
          details: 'Received HTML login page instead of JSON response'
        }, { status: 401 });
      }
      
      return NextResponse.json({ 
        error: 'Invalid response from OCR service',
        response: responseText.substring(0, 500) // Limit response size
      }, { status: 500 });
    }
    
    console.log('Status check successful:', {
      status: statusData.status,
      progress: statusData.progress,
      hasResult: !!statusData.result
    });
    
    // Provide progress estimation based on status
    let progressValue = statusData.progress || 0;
    
    // If progress is not provided by the API, estimate based on status
    if (!statusData.progress && statusData.status) {
      switch (statusData.status) {
        case 'received':
        case 'queued':
          progressValue = 10;
          break;
        case 'processing':
          progressValue = 50;
          break;
        case 'completed':
        case 'processed':  // Handle both 'completed' and 'processed' status
          progressValue = 100;
          break;
        case 'failed':
          progressValue = 0;
          break;
        default:
          progressValue = 5;
      }
    }
    
    // Extract result from the API response structure
    let resultText = null;
    if (statusData.status === 'processed' || statusData.status === 'completed') {
      if (statusData.results && statusData.results.length > 0) {
        resultText = statusData.results[0].transcript;
      } else if (statusData.result) {
        resultText = statusData.result;
      }
    }
    
    return NextResponse.json({
      status: statusData.status === 'processed' ? 'completed' : statusData.status, // Normalize status
      result: resultText,
      progress: Math.min(Math.max(progressValue, 0), 100) // Ensure progress is between 0-100
    });
    
  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json({ 
      error: (err as Error).message || 'Unknown error occurred',
      stack: process.env.NODE_ENV === 'development' ? (err as Error).stack : undefined
    }, { status: 500 });
  }
}
