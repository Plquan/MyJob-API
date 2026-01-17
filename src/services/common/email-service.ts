import nodemailer from 'nodemailer';
import { ENV } from '@/common/constants/env';
import EmailTemplate, { IEmailTemplateOptions } from '@/common/helpers/email-template';

export interface ISendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  fromName?: string;
  useTemplate?: boolean;
  templateOptions?: IEmailTemplateOptions;
}

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  private static initialize() {
    if (!this.transporter) {
      if (!ENV.MAIL_SERVER || !ENV.MAIL_PORT || !ENV.MAIL_USERNAME || !ENV.MAIL_PASSWORD) {
        throw new Error('Gmail SMTP configuration is not complete');
      }

      this.transporter = nodemailer.createTransport({
        host: ENV.MAIL_SERVER,
        port: ENV.MAIL_PORT,
        secure: false,
        auth: {
          user: ENV.MAIL_USERNAME,
          pass: ENV.MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: ENV.MAIL_ENABLE_SSL
        }
      });
    }
  }

  static async sendEmail(options: ISendEmailOptions): Promise<void> {
    this.initialize();

    if (!this.transporter) {
      throw new Error('Email transporter is not initialized');
    }

    const fromEmail = options.from || ENV.EMAIL_FROM;
    const fromName = options.fromName || ENV.EMAIL_FROM_NAME;

    // Format "Name <email>"
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

    const mailOptions = {
      from: from,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
    } catch (error: any) {
      console.error('Error sending email:', error);
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
