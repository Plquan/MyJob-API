# Hướng dẫn chuyển từ SendGrid sang Mailtrap

## 1. Cài đặt dependencies

Mở terminal tại thư mục `MyJob-API` và chạy:

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

## 2. Lấy thông tin Mailtrap

1. Truy cập https://mailtrap.io/
2. Đăng nhập hoặc đăng ký tài khoản miễn phí
3. Vào **Email Testing** > **Inboxes** 
4. Chọn inbox của bạn (hoặc tạo mới)
5. Click tab **SMTP Settings**
6. Chọn **Nodemailer** trong dropdown
7. Copy thông tin credentials

## 3. Cập nhật file .env

Thêm/thay thế các biến môi trường trong file `.env`:

```env
# Mailtrap Configuration (thay thế SendGrid)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
EMAIL_FROM=noreply@myjob.com
EMAIL_FROM_NAME=MyJob

# Có thể xóa hoặc comment các dòng SendGrid cũ:
# SENDGRID_API_KEY=
# SENDGRID_FROM_EMAIL=
# SENDGRID_FROM_NAME=
```

**Lưu ý:** Thay `your_mailtrap_username` và `your_mailtrap_password` bằng thông tin từ Mailtrap.

## 4. Xóa package SendGrid (Optional)

Nếu không còn sử dụng SendGrid, có thể xóa:

```bash
npm uninstall @sendgrid/mail
```

## 5. Restart server

```bash
npm run dev
```

## 6. Test gửi email

Email sẽ được gửi đến inbox Mailtrap thay vì email thật. Bạn có thể xem tất cả email test tại dashboard Mailtrap.

## Ưu điểm Mailtrap

- ✅ Miễn phí cho development/testing
- ✅ Không cần verify domain
- ✅ Xem trực tiếp email trong dashboard
- ✅ Kiểm tra spam score, HTML/CSS validation
- ✅ Không gửi email thật (an toàn cho testing)

## Production

Khi deploy lên production, bạn có thể:
1. Sử dụng Mailtrap Production plan
2. Chuyển sang SMTP provider khác (Gmail, AWS SES, Mailgun...)
3. Chỉ cần thay đổi ENV variables, code không cần sửa

