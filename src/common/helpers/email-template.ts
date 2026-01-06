import { ENV } from '@/common/constants/env';

export interface IEmailTemplateOptions {
  title?: string; // Tiêu đề hiển thị trong tab trình duyệt và tiêu đề phụ
  content: string; // Nội dung HTML chính
  footerText?: string;
  companyName?: string;
  companyWebsite?: string;
  logoUrl?: string; // URL logo của công ty (Optional)
  ctaButton?: {     // Nút hành động (Optional)
    text: string;
    url: string;
  }; 
}

/**
 * Email Template Helper - Modern UI Version
 */
export class EmailTemplate {
  // Màu chủ đạo (Brand Color) - Bạn có thể đổi màu này theo brand
  private static readonly PRIMARY_COLOR = '#4F46E5'; // Indigo
  private static readonly TEXT_COLOR = '#1f2937'; // Gray 800
  private static readonly BG_COLOR = '#f3f4f6'; // Gray 100

  /**
   * Tạo button HTML (Helper method)
   * Giúp tạo nút bấm đẹp mắt trong nội dung email
   */
  public static getButton(text: string, url: string): string {
    return `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
        <tr>
          <td align="center" bgcolor="${this.PRIMARY_COLOR}" style="border-radius: 6px;">
            <a href="${url}" target="_blank" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; display: inline-block; padding: 12px 24px; border: 1px solid ${this.PRIMARY_COLOR}; border-radius: 6px;">
              ${text}
            </a>
          </td>
        </tr>
      </table>
    `;
  }

  /**
   * Tạo header HTML
   */
  private static getHeader(title?: string, logoUrl?: string): string {
    const appName = ENV.EMAIL_FROM_NAME || 'MyJob';
    
    // Header logic: Nếu có logo thì hiện logo, không thì hiện tên App
    const brandDisplay = logoUrl 
      ? `<img src="${logoUrl}" alt="${appName}" width="120" style="display: block; border: 0; outline: none; text-decoration: none; max-width: 150px; height: auto;">`
      : `<h1 style="margin: 0; color: ${this.PRIMARY_COLOR}; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">${appName}</h1>`;

    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title || appName}</title>
        </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${this.BG_COLOR}; color: ${this.TEXT_COLOR}; line-height: 1.6;">
        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
          ${title || 'Thông báo mới từ ' + appName}
        </div>
        
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: ${this.BG_COLOR}; width: 100%;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                
                <tr>
                  <td height="6" style="background-color: ${this.PRIMARY_COLOR}; line-height: 6px; font-size: 6px;">&nbsp;</td>
                </tr>

                <tr>
                  <td style="padding: 30px 40px 10px 40px; text-align: center;">
                    ${brandDisplay}
                  </td>
                </tr>

                <tr>
                  <td style="padding: 20px 40px 40px 40px; text-align: left;">
                    ${title ? `<h2 style="margin: 0 0 20px 0; font-size: 20px; color: #111827; font-weight: 600;">${title}</h2>` : ''}
    `;
  }

  /**
   * Tạo footer HTML
   */
  private static getFooter(footerText?: string, companyWebsite?: string): string {
    const appName = ENV.EMAIL_FROM_NAME || 'MyJob';
    const currentYear = new Date().getFullYear();
    const website = companyWebsite || '#';
    
    return `
                  </td>
                </tr>
              </table>
              <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto;">
                <tr>
                  <td style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
                    ${footerText ? `<p style="margin: 0 0 10px 0;">${footerText}</p>` : ''}
                    
                    <p style="margin: 0 0 10px 0;">
                      © ${currentYear} <strong>${appName}</strong>. All rights reserved.
                    </p>
                    
                    ${website !== '#' ? `
                    <p style="margin: 0;">
                      <a href="${website}" style="color: ${this.PRIMARY_COLOR}; text-decoration: none; font-weight: 500;">Truy cập Website</a>
                      <span style="margin: 0 8px;">|</span>
                      <a href="#" style="color: ${this.PRIMARY_COLOR}; text-decoration: none; font-weight: 500;">Liên hệ hỗ trợ</a>
                    </p>
                    ` : ''}
                    
                    <p style="margin: 20px 0 0 0; color: #9ca3af; font-size: 11px; font-style: italic;">
                      Email này được gửi tự động từ hệ thống. Vui lòng không trả lời email này.
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
   * Tạo email HTML hoàn chỉnh
   */
  static createEmailTemplate(options: IEmailTemplateOptions): string {
    const { title, content, footerText, companyWebsite, logoUrl, ctaButton } = options;
    
    const header = this.getHeader(title, logoUrl);
    const footer = this.getFooter(footerText, companyWebsite);
    
    // Nếu có nút CTA trong options thì render thêm nút vào cuối nội dung
    let finalContent = content;
    if (ctaButton) {
      finalContent += this.getButton(ctaButton.text, ctaButton.url);
    }

    // Wrap content với styling cơ bản để chữ đẹp hơn
    const styledContent = `
      <div style="color: #374151; font-size: 16px; line-height: 24px;">
        ${finalContent}
      </div>
    `;
    
    return header + styledContent + footer;
  }

  /**
   * Wrapper đơn giản
   */
  static wrapContent(content: string, title?: string): string {
    return this.createEmailTemplate({
      title,
      content,
    });
  }
}

export default EmailTemplate;