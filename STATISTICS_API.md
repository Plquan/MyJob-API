# Statistics API Documentation

API endpoints cho trang dashboard quản trị viên. Tất cả endpoints yêu cầu authentication.

## Base URL
```
/api/statistics
```

## Endpoints

### 1. Get Statistics Summary
Lấy tổng quan thống kê (số lượng ứng viên, nhà tuyển dụng, bài đăng, ứng tuyển và doanh thu)

**Endpoint:** `GET /api/statistics/stats`

**Query Parameters:**
- `startDate` (optional): Ngày bắt đầu (ISO 8601 format: YYYY-MM-DD)
- `endDate` (optional): Ngày kết thúc (ISO 8601 format: YYYY-MM-DD)

**Response:**
```json
{
  "jobSeekers": 27820,
  "employers": 4828,
  "jobPosts": 8779,
  "applications": 36,
  "revenue": 125000000
}
```

**Example:**
```bash
GET /api/statistics/stats
GET /api/statistics/stats?startDate=2024-01-01&endDate=2024-12-31
```

---

### 2. Get User Chart Data
Lấy dữ liệu biểu đồ người dùng theo tháng (Job Seeker và Employer)

**Endpoint:** `GET /api/statistics/user-chart`

**Query Parameters:**
- `startDate` (optional): Ngày bắt đầu
- `endDate` (optional): Ngày kết thúc

**Response:**
```json
[
  {
    "date": "2024-01",
    "jobSeeker": 1.0,
    "employer": 0.8
  },
  {
    "date": "2024-02",
    "jobSeeker": 1.2,
    "employer": 0.9
  }
]
```

**Note:** Giá trị `jobSeeker` và `employer` được chia cho 1000 để hiển thị theo đơn vị nghìn (k)

**Example:**
```bash
GET /api/statistics/user-chart
GET /api/statistics/user-chart?startDate=2024-01-01&endDate=2024-06-30
```

---

### 3. Get Job Post Chart Data
Lấy dữ liệu biểu đồ bài đăng tuyển dụng theo tháng và trạng thái

**Endpoint:** `GET /api/statistics/job-post-chart`

**Query Parameters:**
- `startDate` (optional): Ngày bắt đầu
- `endDate` (optional): Ngày kết thúc

**Response:**
```json
[
  {
    "month": "08/2023",
    "status": "Chờ duyệt",
    "value": 50
  },
  {
    "month": "08/2023",
    "status": "Đã duyệt",
    "value": 100
  },
  {
    "month": "08/2023",
    "status": "Không duyệt",
    "value": 30
  }
]
```

**Status Values:**
- `Chờ duyệt`: Pending approval
- `Đã duyệt`: Approved
- `Không duyệt`: Rejected

**Example:**
```bash
GET /api/statistics/job-post-chart
GET /api/statistics/job-post-chart?startDate=2023-08-01&endDate=2024-03-31
```

---

### 4. Get Top 5 Careers
Lấy top 5 ngành nghề có nhiều bài đăng tuyển dụng nhất

**Endpoint:** `GET /api/statistics/top-careers`

**Query Parameters:**
- `startDate` (optional): Ngày bắt đầu
- `endDate` (optional): Ngày kết thúc

**Response:**
```json
[
  {
    "type": "IT/Software",
    "value": 35
  },
  {
    "type": "Marketing",
    "value": 25
  },
  {
    "type": "Sales",
    "value": 20
  },
  {
    "type": "Finance",
    "value": 12
  },
  {
    "type": "Others",
    "value": 8
  }
]
```

**Example:**
```bash
GET /api/statistics/top-careers
GET /api/statistics/top-careers?startDate=2024-01-01&endDate=2024-12-31
```

---

### 5. Get Application Chart Data
Lấy dữ liệu biểu đồ lượt ứng tuyển theo tháng

**Endpoint:** `GET /api/statistics/application-chart`

**Query Parameters:**
- `startDate` (optional): Ngày bắt đầu
- `endDate` (optional): Ngày kết thúc

**Response:**
```json
[
  {
    "month": "01/2024",
    "value": 2.0
  },
  {
    "month": "02/2024",
    "value": 1.8
  },
  {
    "month": "03/2024",
    "value": 1.5
  }
]
```

**Note:** Giá trị `value` được chia cho 1000 để hiển thị theo đơn vị nghìn (k)

**Example:**
```bash
GET /api/statistics/application-chart
GET /api/statistics/application-chart?startDate=2024-01-01&endDate=2024-06-30
```

---

### 6. Get Revenue by Package Chart
Lấy dữ liệu doanh thu theo gói dịch vụ (từ bảng package_purchase)

**Endpoint:** `GET /api/statistics/revenue-package-chart`

**Query Parameters:**
- `startDate` (optional): Ngày bắt đầu
- `endDate` (optional): Ngày kết thúc

**Response:**
```json
[
  {
    "packageName": "Cơ bản",
    "revenue": 25000000
  },
  {
    "packageName": "Tiêu chuẩn",
    "revenue": 45000000
  },
  {
    "packageName": "Cao cấp",
    "revenue": 35000000
  },
  {
    "packageName": "Doanh nghiệp",
    "revenue": 20000000
  }
]
```

**Example:**
```bash
GET /api/statistics/revenue-package-chart
GET /api/statistics/revenue-package-chart?startDate=2024-01-01&endDate=2024-12-31
```

---

### 7. Get All Dashboard Stats (Combined)
Lấy tất cả dữ liệu thống kê cho dashboard trong một lần gọi

**Endpoint:** `GET /api/statistics/dashboard`

**Query Parameters:**
- `startDate` (optional): Ngày bắt đầu
- `endDate` (optional): Ngày kết thúc

**Response:**
```json
{
  "stats": {
    "jobSeekers": 27820,
    "employers": 4828,
    "jobPosts": 8779,
    "applications": 36,
    "revenue": 125000000
  },
  "userChart": [
    {
      "date": "2024-01",
      "jobSeeker": 1.0,
      "employer": 0.8
    }
  ],
  "jobPostChart": [
    {
      "month": "08/2023",
      "status": "Chờ duyệt",
      "value": 50
    }
  ],
  "topCareers": [
    {
      "type": "IT/Software",
      "value": 35
    }
  ],
  "applicationChart": [
    {
      "month": "01/2024",
      "value": 2.0
    }
  ],
  "revenuePackageChart": [
    {
      "packageName": "Cơ bản",
      "revenue": 25000000
    }
  ]
}
```

**Example:**
```bash
GET /api/statistics/dashboard
GET /api/statistics/dashboard?startDate=2024-01-01&endDate=2024-12-31
```

---

## Authentication
Tất cả endpoints yêu cầu authentication header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Responses
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "UnauthorizedAccess"
}
```

```json
{
  "statusCode": 500,
  "message": "Internal Server Error",
  "error": "ServerError"
}
```

## Data Sources

### Stats (Thống kê tổng quan)
- **Job Seekers**: Đếm từ bảng `users` với `role = CANDIDATE`
- **Employers**: Đếm từ bảng `users` với `role = EMPLOYER`
- **Job Posts**: Đếm từ bảng `job_post`
- **Applications**: Đếm từ bảng `job_post_activities`
- **Revenue**: Tổng từ cột `price` trong bảng `package_purchases`

### Charts (Biểu đồ)
- **User Chart**: Group by tháng từ `users.createdAt`
- **Job Post Chart**: Group by tháng và status từ `job_post`
- **Top Careers**: Group by `careerId` và join với bảng `careers`, limit 5
- **Application Chart**: Group by tháng từ `job_post_activities`
- **Revenue Package Chart**: Group by `packageId`, join với bảng `packages`, sum `price`

## Notes
- Tất cả date filters sử dụng `createdAt` field trừ revenue chart sử dụng `paymentDate`
- Date range là inclusive (bao gồm cả startDate và endDate)
- Nếu không truyền date parameters, API sẽ trả về tất cả dữ liệu
- User chart và Application chart có giá trị chia cho 1000 để hiển thị theo đơn vị nghìn (k)

