import { ENV } from '@/common/constants/env';

export interface IEmailTemplateOptions {
  title?: string;
  content: string;
  footerText?: string;
  companyName?: string;
  companyWebsite?: string;
}

/**
 * Email Template Helper
 * Tạo email HTML với header và footer sẵn
 */
export class EmailTemplate {
  /**
   * Tạo header HTML cho email
   */
  private static getHeader(title?: string): string {
    const appName = ENV.SENDGRID_FROM_NAME || 'MyJob';
    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title || appName}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
          <tr>
            <td style="padding: 20px 0; text-align: center;">
              <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                      ${appName}
                    </h1>
                    ${title ? `<p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">${title}</p>` : ''}
                  </td>
                </tr>
                <!-- Content Container -->
                <tr>
                  <td style="padding: 40px 30px;">
    `;
  }

  /**
   * Tạo footer HTML cho email
   */
  private static getFooter(footerText?: string, companyWebsite?: string): string {
    const appName = ENV.SENDGRID_FROM_NAME || 'MyJob';
    const currentYear = new Date().getFullYear();
    const website = companyWebsite || '#';
    
    return `
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                    ${footerText ? `<p style="margin: 0 0 15px 0; color: #6c757d; font-size: 14px; line-height: 1.6;">${footerText}</p>` : ''}
                    <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">
                      © ${currentYear} ${appName}. Tất cả quyền được bảo lưu.
                    </p>
                    ${website !== '#' ? `
                    <p style="margin: 0; color: #6c757d; font-size: 14px;">
                      <a href="${website}" style="color: #667eea; text-decoration: none;">Truy cập website</a>
                    </p>
                    ` : ''}
                    <p style="margin: 15px 0 0 0; color: #adb5bd; font-size: 12px;">
                      Email này được gửi tự động, vui lòng không trả lời.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  /**
   * Tạo email HTML hoàn chỉnh với header và footer
   */
  static createEmailTemplate(options: IEmailTemplateOptions): string {
    const { title, content, footerText, companyWebsite } = options;
    
    const header = this.getHeader(title);
    const footer = this.getFooter(footerText, companyWebsite);
    
    // Wrap content với styling
    const styledContent = `
                    <div style="color: #333333; font-size: 16px; line-height: 1.6;">
                      ${content}
                    </div>
    `;
    
    return header + styledContent + footer;
  }

  /**
   * Tạo email template đơn giản (chỉ wrap content)
   */
  static wrapContent(content: string, title?: string): string {
    return this.createEmailTemplate({
      title,
      content,
    });
  }
}

export default EmailTemplate;

