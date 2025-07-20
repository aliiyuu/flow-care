import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalyticsData {
  severityDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  averageAge: number;
  averagePriority: number;
  averageWaitTime: number;
  totalPatients: number;
  completionRate: number;
  highPriorityCases: number;
  waitingPatients: number;
  inTreatmentPatients: number;
}

export const exportAnalyticsToPDF = async (analytics: AnalyticsData) => {
  try {
    // Create a new jsPDF instance
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(20, 83, 45); // Teal color
    pdf.text('TriageFlow Care - Analytics Report', 20, 30);
    
    // Date
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 40);
    
    // Summary Section
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Executive Summary', 20, 55);
    
    pdf.setFontSize(11);
    let yPos = 65;
    
    // Key metrics in a clean layout
    const metrics = [
      ['Total Patients', analytics.totalPatients.toString()],
      ['Average Age', `${analytics.averageAge} years`],
      ['Average Priority Score', analytics.averagePriority.toString()],
      ['Average Wait Time', `${analytics.averageWaitTime} minutes`],
      ['Completion Rate', `${analytics.completionRate}%`],
      ['High Priority Cases', analytics.highPriorityCases.toString()],
      ['Currently Waiting', analytics.waitingPatients.toString()],
      ['In Treatment', analytics.inTreatmentPatients.toString()]
    ];
    
    metrics.forEach(([label, value]) => {
      pdf.text(label + ':', 25, yPos);
      pdf.setFont('helvetica', 'bold');
      pdf.text(value, 80, yPos);
      pdf.setFont('helvetica', 'normal');
      yPos += 8;
    });
    
    // Severity Distribution
    yPos += 10;
    pdf.setFontSize(14);
    pdf.text('Severity Distribution', 20, yPos);
    yPos += 10;
    
    pdf.setFontSize(11);
    Object.entries(analytics.severityDistribution).forEach(([severity, count]) => {
      const percentage = analytics.totalPatients > 0 ? ((count / analytics.totalPatients) * 100).toFixed(1) : '0';
      pdf.text(`${severity.charAt(0).toUpperCase() + severity.slice(1)}:`, 25, yPos);
      pdf.text(`${count} patients (${percentage}%)`, 60, yPos);
      yPos += 7;
    });
    
    // Status Distribution
    yPos += 10;
    pdf.setFontSize(14);
    pdf.text('Patient Status Distribution', 20, yPos);
    yPos += 10;
    
    pdf.setFontSize(11);
    Object.entries(analytics.statusDistribution).forEach(([status, count]) => {
      const displayStatus = status.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      const percentage = analytics.totalPatients > 0 ? ((count / analytics.totalPatients) * 100).toFixed(1) : '0';
      pdf.text(`${displayStatus}:`, 25, yPos);
      pdf.text(`${count} patients (${percentage}%)`, 60, yPos);
      yPos += 7;
    });
    
    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('TriageFlow Care - Emergency Triage Management System', 20, pageHeight - 20);
    pdf.text('Confidential Medical Data - Handle According to HIPAA Guidelines', 20, pageHeight - 15);
    
    // Save the PDF
    const fileName = `TriageFlow_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const exportAnalyticsWithChartsToPDF = async (elementId: string) => {
  try {
    // Capture the analytics dashboard as an image
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Analytics element not found');
    }
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(20, 83, 45);
    pdf.text('TriageFlow Care - Analytics Dashboard', 20, 20);
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 28);
    
    // Calculate image dimensions to fit page
    const imgWidth = pageWidth - 40; // 20mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add image to PDF
    if (imgHeight <= pageHeight - 60) {
      // Image fits on one page
      pdf.addImage(imgData, 'PNG', 20, 35, imgWidth, imgHeight);
    } else {
      // Image needs to be scaled down
      const scaledHeight = pageHeight - 60;
      const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
      pdf.addImage(imgData, 'PNG', 20, 35, scaledWidth, scaledHeight);
    }
    
    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('TriageFlow Care - Emergency Triage Management System', 20, pageHeight - 15);
    pdf.text('Confidential Medical Data - Handle According to HIPAA Guidelines', 20, pageHeight - 10);
    
    const fileName = `TriageFlow_Dashboard_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating PDF with charts:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
