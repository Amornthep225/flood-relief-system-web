## 🔌 โครงสร้าง API (Endpoints)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **POST** | `/api/auth/login` | เข้าสู่ระบบเพื่อรับ JWT Token | ❌ |
| **POST** | `/api/auth/register` | ลงทะเบียนผู้ใช้งานใหม่ | ❌ |
| **GET** | `/api/users/profile` | ดูข้อมูลโปรไฟล์ของผู้ใช้งานปัจจุบัน |  |
| **POST** | `/api/sos-requests` | สร้างคำขอความช่วยเหลือ (SOS) ใหม่ |  |
| **GET** | `/api/sos-requests/my` | ดูรายการคำขอทั้งหมดของผู้ประสบภัยรายนั้น |  |
| **GET** | `/api/sos-requests/{id}` | ดูรายละเอียดและสถานะของคำขอแบบเฉพาะเจาะจง |  |
| **PUT** | `/api/sos-requests/{id}/cancel` | ยกเลิกคำขอความช่วยเหลือ |  |
| **GET** | `/api/relief-items/active` | ดึงรายการสิ่งของบรรเทาทุกข์ที่เปิดให้เลือก |  |

---