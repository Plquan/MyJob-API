import sgMail from '@sendgrid/mail';
import { ENV } from '@/common/constants/env';
import EmailTemplate, { IEmailTemplateOptions } from '@/common/helpers/email-template';

export interface ISendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  fromName?: string;
  useTemplate?: boolean; // Có sử dụng template header/footer không
  templateOptions?: IEmailTemplateOptions; // Options cho template
}

export class EmailService {
  private static initialized = false;

  private static initialize() {
    if (!this.initialized && ENV.SENDGRID_API_KEY) {
      sgMail.setApiKey(ENV.SENDGRID_API_KEY);
      this.initialized = true;
    }
  }

  /**
   * Gửi email đơn giản
   */
  static async sendEmail(options: ISendEmailOptions): Promise<void> {
    this.initialize();

    if (!ENV.SENDGRID_API_KEY) {
      throw new Error('SendGrid API key is not configured');
    }

    const fromEmail = options.from || ENV.SENDGRID_FROM_EMAIL;
    const fromName = options.fromName || ENV.SENDGRID_FROM_NAME;
    
    // SendGrid hỗ trợ format "Name <email>" nếu email đã được verify
    const from = fromName ? `${fromName} <${fromEmail}>` : fromEmail;

    // Xử lý template nếu có yêu cầu
    let htmlContent = options.html;
    if (options.useTemplate && htmlContent) {
      if (options.templateOptions) {
        htmlContent = EmailTemplate.createEmailTemplate({
          ...options.templateOptions,
          content: htmlContent,
        });
      } else {
        htmlContent = EmailTemplate.wrapContent(htmlContent, options.subject);
      }
    }

    const msg = {
      to: options.to,
      from: from,
      subject: options.subject,
      text: options.text,
      html: htmlContent,
    };

    try {
      await sgMail.send(msg);
    } catch (error: any) {
      console.error('Error sending email:', error);
      if (error.response) {
        console.error('SendGrid error response:', error.response.body);
      }
      throw error;
    }
  }

  /**
   * Gửi email HTML
   */
  static async sendHtmlEmail(
    to: string | string[],
    subject: string,
    htmlContent: string,
    options?: {
      from?: string;
      fromName?: string;
      useTemplate?: boolean;
      templateOptions?: IEmailTemplateOptions;
    }
  ): Promise<void> {
    return this.sendEmail({
      to,
      subject,
      html: htmlContent,
      from: options?.from,
      fromName: options?.fromName,
      useTemplate: options?.useTemplate ?? true, // Mặc định sử dụng template
      templateOptions: options?.templateOptions,
    });
  }

  /**
   * Gửi email text
   */
  static async sendTextEmail(
    to: string | string[],
    subject: string,
    textContent: string,
    from?: string,
    fromName?: string
  ): Promise<void> {
    return this.sendEmail({
      to,
      subject,
      text: textContent,
      from,
      fromName,
    });
  }

  /**
   * Gửi email cho nhiều người nhận
   */
  static async sendBulkEmail(
    recipients: string[],
    subject: string,
    content: { text?: string; html?: string },
    options?: {
      from?: string;
      fromName?: string;
      useTemplate?: boolean;
      templateOptions?: IEmailTemplateOptions;
    }
  ): Promise<void> {
    return this.sendEmail({
      to: recipients,
      subject,
      text: content.text,
      html: content.html,
      from: options?.from,
      fromName: options?.fromName,
      useTemplate: options?.useTemplate ?? true,
      templateOptions: options?.templateOptions,
    });
  }
}

export default EmailService;

