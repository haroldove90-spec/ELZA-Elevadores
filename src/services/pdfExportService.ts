import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export const pdfExportService = {
  // Direct High Quality PDF Generation
  async exportElementToPdf(elementId: string, filename: string): Promise<boolean> {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found.`);
      return false;
    }

    try {
      // Temporarily ensure high visibility and standard layout
      const canvas = await html2canvas(element, {
        scale: 2, // 2x DPI for ultra sharp text and signatures
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: 1200,
        onclone: (_clonedDoc, clonedElement) => {
          // Normalize any inline styles if present
          if (clonedElement) {
            clonedElement.style.backgroundColor = '#FFFFFF';
          }
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      // Letter size: 215.9 x 279.4 mm (portrait)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth - 10; // 5mm margin left and right
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= pdfHeight - 10) {
        // Fits comfortably on a single letter page
        pdf.addImage(imgData, 'JPEG', 5, 5, imgWidth, imgHeight);
      } else {
        // Multi-page if necessary
        let heightLeft = imgHeight;
        let position = 5;

        pdf.addImage(imgData, 'JPEG', 5, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight + 5;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 5, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
      }

      pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback: trigger print dialog so the user never gets blocked
      window.print();
      return false;
    }
  },

  // Native Print Dialog
  printElement(): void {
    window.print();
  },
};
