import { Resend } from 'resend';

export class EmailService {
  static resend = new Resend(process.env.RESEND_API_KEY);
  static fallbackService = null;
  
  static async sendEmail({ to, subject, html, attachments = [] }) {
    try {
      // Try Resend first
      await this.resend.emails.send({
        from: 'reports@seoanalyzer.pro',
        to,
        subject,
        html,
        attachments: attachments.map(pdf => ({
          filename: pdf.filename,
          content: pdf.content
        }))
      });
    } catch (error) {
      console.error('Resend email failed:', error);
      
      // Try fallback service if available
      if (this.fallbackService) {
        try {
          await this.fallbackService.send({
            to,
            subject,
            html,
            attachments
          });
        } catch (fallbackError) {
          console.error('Fallback email service failed:', fallbackError);
          throw new Error('All email delivery attempts failed');
        }
      } else {
        throw error;
      }
    }
  }
  
  static setFallbackService(service) {
    this.fallbackService = service;
  }
}