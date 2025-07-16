import { format, addDays, parse, isAfter } from 'date-fns';
import { PdfExportService } from './pdfExportService';
import { EmailService } from './emailService';

export class EmailScheduler {
  static scheduleKey = 'reportSchedule';
  static lastRunKey = 'lastReportRun';
  
  static init() {
    // Check if we need to send reports every hour
    setInterval(() => {
      this.checkAndSendReports();
    }, 60 * 60 * 1000); // Every hour
    
    // Do an initial check
    this.checkAndSendReports();
  }
  
  static async checkAndSendReports() {
    const schedule = this.getSchedule();
    if (!schedule?.enabled) return;
    
    const now = new Date();
    const lastRun = this.getLastRun();
    const nextRun = this.getNextRunDate(schedule, lastRun);
    
    if (isAfter(now, nextRun)) {
      try {
        await this.generateAndSendReports(schedule);
        this.setLastRun(now);
      } catch (error) {
        console.error('Failed to send scheduled reports:', error);
      }
    }
  }
  
  static async generateAndSendReports(schedule) {
    const { recipients, includeSeoReport, includeRankTracker } = schedule;
    const emailList = recipients.split(',').map(email => email.trim());
    
    if (emailList.length === 0) return;
    
    // Get white label settings
    const whiteLabelSettings = localStorage.getItem('whiteLabel')
      ? JSON.parse(localStorage.getItem('whiteLabel'))
      : null;
    
    const clientName = whiteLabelSettings?.clientName || 'Your Website';
    const preparedBy = whiteLabelSettings?.preparedBy || 'SEO Analyzer Pro';
    
    // Generate reports
    const reports = [];
    
    if (includeSeoReport) {
      const seoReport = await this.generateSeoReport(whiteLabelSettings);
      if (seoReport) reports.push(seoReport);
    }
    
    if (includeRankTracker) {
      const rankReport = await this.generateRankReport(whiteLabelSettings);
      if (rankReport) reports.push(rankReport);
    }
    
    if (reports.length === 0) {
      throw new Error('No reports were generated');
    }
    
    // Send email to each recipient
    const emailPromises = emailList.map(email =>
      EmailService.sendEmail({
        to: email,
        subject: `Weekly SEO Report for ${clientName}`,
        html: this.generateEmailTemplate({
          clientName,
          preparedBy,
          reportsIncluded: {
            seo: includeSeoReport,
            rank: includeRankTracker
          }
        }),
        attachments: reports
      })
    );
    
    await Promise.all(emailPromises);
  }
  
  static async generateSeoReport(whiteLabelSettings) {
    try {
      // Get latest scan data
      const scanHistory = localStorage.getItem('scanHistory');
      if (!scanHistory) return null;
      
      const latestScan = JSON.parse(scanHistory)[0];
      if (!latestScan) return null;
      
      // Create a temporary element to render the report
      const tempElement = document.createElement('div');
      document.body.appendChild(tempElement);
      
      // Generate PDF
      const pdf = await PdfExportService.exportSeoReport(
        latestScan,
        tempElement,
        whiteLabelSettings
      );
      
      document.body.removeChild(tempElement);
      return pdf;
    } catch (error) {
      console.error('Failed to generate SEO report:', error);
      return null;
    }
  }
  
  static async generateRankReport(whiteLabelSettings) {
    try {
      // Get rank tracking data
      const rankHistory = localStorage.getItem('rankHistory');
      if (!rankHistory) return null;
      
      const data = JSON.parse(rankHistory);
      if (!data.length) return null;
      
      // Create a temporary element to render the report
      const tempElement = document.createElement('div');
      document.body.appendChild(tempElement);
      
      // Generate PDF
      const pdf = await PdfExportService.exportRankHistoryTable(
        data,
        whiteLabelSettings
      );
      
      document.body.removeChild(tempElement);
      return pdf;
    } catch (error) {
      console.error('Failed to generate rank report:', error);
      return null;
    }
  }
  
  static generateEmailTemplate({ clientName, preparedBy, reportsIncluded }) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .content { margin-bottom: 30px; }
            .footer { text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Weekly SEO Report</h1>
              <p>For ${clientName}</p>
            </div>
            
            <div class="content">
              <p>Your weekly SEO performance report is attached to this email.</p>
              
              <h3>Included Reports:</h3>
              <ul>
                ${reportsIncluded.seo ? '<li>SEO Analysis Report</li>' : ''}
                ${reportsIncluded.rank ? '<li>Rank Tracking Report</li>' : ''}
              </ul>
              
              <p>For detailed analysis and real-time updates, please visit your dashboard.</p>
            </div>
            
            <div class="footer">
              <p>Generated by ${preparedBy}</p>
              <p>Report generated on ${format(new Date(), 'MMMM d, yyyy')}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
  
  static async sendTestEmail(schedule) {
    if (!schedule.recipients) {
      throw new Error('No recipients specified');
    }
    
    await this.generateAndSendReports(schedule);
  }
  
  static getSchedule() {
    const saved = localStorage.getItem(this.scheduleKey);
    return saved ? JSON.parse(saved) : null;
  }
  
  static getLastRun() {
    const saved = localStorage.getItem(this.lastRunKey);
    return saved ? new Date(JSON.parse(saved)) : null;
  }
  
  static setLastRun(date) {
    localStorage.setItem(this.lastRunKey, JSON.stringify(date));
  }
  
  static getNextRunDate(schedule, lastRun) {
    const { day, time } = schedule;
    const [hours, minutes] = time.split(':').map(Number);
    
    let nextRun = parse(
      `${day} ${hours}:${minutes}`,
      'EEEE HH:mm',
      new Date()
    );
    
    if (lastRun && !isAfter(nextRun, lastRun)) {
      nextRun = addDays(nextRun, 7);
    }
    
    return nextRun;
  }
  
  static getNextScheduledDate(schedule) {
    if (!schedule.enabled) return 'Not scheduled';
    
    const nextRun = this.getNextRunDate(schedule, this.getLastRun());
    return format(nextRun, 'MMMM d, yyyy h:mm a');
  }
}

// Initialize scheduler when the service is loaded
EmailScheduler.init();