import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

export class PdfExportService {
  static async exportSeoReport(data, elementRef, whiteLabelSettings = null) {
    try {
      const cleanupFn = this.applyWhiteLabelToElement(elementRef, whiteLabelSettings, {
        title: `SEO Analysis - ${data.url}`,
        date: format(new Date(), 'yyyy-MM-dd')
      });

      const pdf = await this.generatePdf(elementRef, {
        title: whiteLabelSettings?.clientName ? `SEO Analysis for ${whiteLabelSettings.clientName}` : `SEO Analysis - ${data.url}`,
        filename: `seo-analysis-${this.formatUrlForFilename(data.url)}-${format(new Date(), 'yyyy-MM-dd')}.pdf`,
        orientation: 'portrait',
        customStyles: true,
        whiteLabelSettings
      });

      this.addReportMetadata(pdf, data, whiteLabelSettings);
      cleanupFn();
      pdf.save(`seo-analysis-${this.formatUrlForFilename(data.url)}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      return true;
    } catch (error) {
      console.error('Error exporting SEO report to PDF:', error);
      return false;
    }
  }

  static async exportRankHistory(keyword, domain, elementRef, whiteLabelSettings = null) {
    try {
      const pdf = await this.generatePdf(elementRef, {
        title: `Rank History - ${keyword} on ${domain}`,
        orientation: 'landscape'
      });
      pdf.save(`rank-history-${keyword}-${domain}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      return true;
    } catch (error) {
      console.error('Error exporting rank history to PDF:', error);
      return false;
    }
  }

  static async exportRankHistoryTable(data, whiteLabelSettings = null) {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const title = whiteLabelSettings?.clientName 
        ? `Rank History Report for ${whiteLabelSettings.clientName}`
        : 'Rank History Report';

      pdf.setFontSize(16);
      pdf.text(title, 20, 20);
      pdf.setFontSize(10);

      const headers = ['Date', 'Position', 'URL'];
      const rows = data.map(entry => [
        format(new Date(entry.timestamp), 'yyyy-MM-dd HH:mm'),
        entry.position || 'Not found',
        entry.url || '-'
      ]);

      pdf.autoTable({
        head: [headers],
        body: rows,
        startY: 30,
        margin: { top: 20 },
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 247, 250] }
      });

      pdf.save(`rank-history-table-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      return true;
    } catch (error) {
      console.error('Error generating rank history table PDF:', error);
      return false;
    }
  }

  static async generatePdf(element, options = {}) {
    const { orientation = 'portrait' } = options;
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    });

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 10;

      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  static formatUrlForFilename(url) {
    return url
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .substring(0, 30);
  }

  static applyWhiteLabelToElement(element, settings, reportInfo) {
    // Store original styles
    const originalStyles = {};
    
    if (settings) {
      if (settings.logoUrl) {
        // Add logo
      }
      if (settings.theme) {
        // Apply theme
      }
    }

    return () => {
      // Cleanup function - restore original styles
      Object.keys(originalStyles).forEach(key => {
        element.style[key] = originalStyles[key];
      });
    };
  }

  static addReportMetadata(pdf, data, whiteLabelSettings) {
    if (whiteLabelSettings?.preparedBy) {
      pdf.setFontSize(8);
      pdf.text(`Prepared by: ${whiteLabelSettings.preparedBy}`, 10, pdf.internal.pageSize.height - 10);
    }
  }
}