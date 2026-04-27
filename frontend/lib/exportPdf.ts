import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports a given HTML element to a PDF file using html2canvas and jsPDF.
 * Ensures the styling is captured and formatted for the Obsidian Lens standard.
 *
 * @param element The HTML element to capture.
 * @param filename The name of the downloaded PDF file.
 */
export const exportReportToPdf = async (element: HTMLElement, filename: string = 'ETHYX_Audit_Report.pdf') => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution for better text clarity
      useCORS: true,
      logging: false,
      backgroundColor: '#1C2128', // Match the surface-dim background
    });

    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();

    let heightLeft = pdfHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    // Add subsequent pages if the content overflows
    while (heightLeft > 0) {
      position = heightLeft - pdfHeight; // Shift position up by one page height
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw new Error('PDF generation failed.');
  }
};
