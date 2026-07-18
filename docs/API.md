## 🔌 โครงสร้าง API (Endpoints)

### 🔐 1. Auth (ระบบยืนยันตัวตนและการลงทะเบียน)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **POST** | `/api/auth/user-register` | ลงทะเบียนบัญชีผู้ใช้งานทั่วไป / ผู้ประสบภัย | ❌ |
| **POST** | `/api/auth/user-login` | เข้าสู่ระบบผู้ใช้งานทั่วไป / ผู้ประสบภัย (รับ JWT Token) | ❌ |
| **POST** | `/api/auth/staff-login` | เข้าสู่ระบบสำหรับเจ้าหน้าที่ช่วยเหลือภาคสนาม | ❌ |
| **POST** | `/api/auth/staff-register` | ลงทะเบียนบัญชีเจ้าหน้าที่ช่วยเหลือใหม่ | ❌ |
| **POST** | `/api/auth/admin-login` | เข้าสู่ระบบสำหรับผู้ดูแลระบบ (Admin) | ❌ |
| **POST** | `/api/auth/admin-register` | ลงทะเบียนบัญชีผู้ดูแลระบบใหม่ | ❌ |

### 🏢 2. Centers (ระบบจัดการศูนย์บรรเทาทุกข์)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **GET** | `/api/centers` | ดึงข้อมูลรายการศูนย์บรรเทาทุกข์ทั้งหมด | 🔒 |
| **POST** | `/api/centers` | เพิ่มข้อมูลศูนย์บรรเทาทุกข์ใหม่ | 🔒 |
| **GET** | `/api/centers/{id}` | ดูรายละเอียดของศูนย์บรรเทาทุกข์แบบเฉพาะเจาะจง | 🔒 |
| **PUT** | `/api/centers/{id}` | แก้ไขข้อมูลรายละเอียดของศูนย์บรรเทาทุกข์ | 🔒 |
| **DELETE** | `/api/centers/{id}` | ลบข้อมูลศูนย์บรรเทาทุกข์ออกจากระบบ | 🔒 |

### 📂 3. Relief Categories (หมวดหมู่สิ่งของบรรเทาทุกข์)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **GET** | `/api/relief-categories` | ดึงข้อมูลหมวดหมู่สิ่งของทั้งหมด | 🔒 |
| **POST** | `/api/relief-categories` | เพิ่มหมวดหมู่สิ่งของใหม่ | 🔒 |
| **GET** | `/api/relief-categories/active` | ดึงหมวดหมู่สิ่งของเฉพาะที่เปิดใช้งานอยู่ (Active) | 🔒 |
| **GET** | `/api/relief-categories/{id}` | ดูรายละเอียดของหมวดหมู่สิ่งของตาม ID | 🔒 |
| **PUT** | `/api/relief-categories/{id}` | แก้ไขข้อมูลหมวดหมู่สิ่งของ | 🔒 |
| **DELETE** | `/api/relief-categories/{id}` | ลบหมวดหมู่สิ่งของ | 🔒 |
| **PUT** | `/api/relief-categories/{id}/status` | อัปเดตสถานะการเปิด/ปิดใช้งานหมวดหมู่ | 🔒 |

### 📦 4. Relief Items (รายการสิ่งของบรรเทาทุกข์ในคลัง)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **GET** | `/api/relief-items` | ดึงรายการสิ่งของบรรเทาทุกข์ทั้งหมด | 🔒 |
| **POST** | `/api/relief-items` | เพิ่มรายการสิ่งของบรรเทาทุกข์ใหม่เข้าคลัง | 🔒 |
| **GET** | `/api/relief-items/active` | ดึงรายการสิ่งของเฉพาะที่พร้อมแจกจ่าย (Active) | 🔒 |
| **GET** | `/api/relief-items/category/{categoryId}` | ดึงรายการสิ่งของแยกตามหมวดหมู่ที่ระบุ | 🔒 |
| **GET** | `/api/relief-items/{id}` | ดูรายละเอียดของสิ่งของบรรเทาทุกข์ตาม ID | 🔒 |
| **PUT** | `/api/relief-items/{id}` | แก้ไขข้อมูลรายละเอียดสิ่งของบรรเทาทุกข์ | 🔒 |
| **DELETE** | `/api/relief-items/{id}` | ลบรายการสิ่งของบรรเทาทุกข์ | 🔒 |
| **PUT** | `/api/relief-items/{id}/status` | อัปเดตสถานะการเปิด/ปิดใช้งานของสิ่งของบรรเทาทุกข์ | 🔒 |

### 🚨 5. SOS Requests (ระบบจัดการคำขอความช่วยเหลือ)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **GET** | `/api/sos-requests/my-requests` | ดูประวัติคำขอทั้งหมดของผู้ประสบภัยปัจจุบัน | 🔒 |
| **POST** | `/api/sos-requests` | สร้างคำขอความช่วยเหลือ (SOS) ใหม่ | 🔒 |
| **GET** | `/api/sos-requests` | ดึงรายการคำขอ SOS ทั้งหมดในระบบ (สำหรับ Admin/Staff) | 🔒 |
| **GET** | `/api/sos-requests/my` | ดูคำขอความช่วยเหลือที่สัมพันธ์กับผู้ใช้งานปัจจุบัน | 🔒 |
| **GET** | `/api/sos-requests/{id}` | ดูรายละเอียดและสถานะไทม์ไลน์ของคำขอเฉพาะเจาะจง | 🔒 |
| **PUT** | `/api/sos-requests/{id}/assign` | มอบหมายเจ้าหน้าที่รับผิดชอบในคำขอนี้ | 🔒 |
| **PUT** | `/api/sos-requests/{id}/status` | อัปเดตสถานะขั้นตอนการช่วยเหลือ (Preparing, Delivering, etc.) | 🔒 |
| **PUT** | `/api/sos-requests/{id}/cancel` | ยกเลิกคำขอความช่วยเหลือ | 🔒 |
| **GET** | `/api/sos-requests/statistics` | ดึงข้อมูลสถิติภาพรวมคำขอ SOS ทั้งหมด | 🔒 |
| **GET** | `/api/sos-requests/pending` | ดึงเฉพาะรายการคำขอความช่วยเหลือที่รอดำเนินการ (Pending) | 🔒 |
| **GET** | `/api/sos-requests/staff/me` | ดึงงานคำขอ SOS ทั้งหมดที่เจ้าหน้าที่คนนี้ได้รับมอบหมาย | 🔒 |
| **GET** | `/api/sos-requests/center/{centerId}` | ดึงรายการคำขอ SOS ทั้งหมดที่อยู่ในความดูแลของศูนย์นั้นๆ | 🔒 |

### 👷 6. Staffs (ระบบจัดการบัญชีเจ้าหน้าที่)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **GET** | `/api/staffs` | ดึงรายชื่อเจ้าหน้าที่ทั้งหมดในระบบ | 🔒 |
| **POST** | `/api/staffs` | สร้างบัญชีเจ้าหน้าที่โดยผู้ดูแลระบบ | 🔒 |
| **GET** | `/api/staffs/{id}` | ดูรายละเอียดข้อมูลโปรไฟล์ของเจ้าหน้าที่ตาม ID | 🔒 |
| **PUT** | `/api/staffs/{id}` | แก้ไขข้อมูลของเจ้าหน้าที่ | 🔒 |
| **DELETE** | `/api/staffs/{id}` | ลบบัญชีเจ้าหน้าที่ออกจากระบบ | 🔒 |
| **GET** | `/api/staffs/summary` | ดูข้อมูลสรุปเชิงสถิติการทำงานของเจ้าหน้าที่ | 🔒 |
| **PUT** | `/api/staffs/{id}/status` | อัปเดตสถานะการเปิด/ปิดใช้งานบัญชีของเจ้าหน้าที่ | 🔒 |

### 👥 7. Users (ระบบจัดการบัญชีผู้ใช้งาน)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **GET** | `/api/users` | ดึงรายชื่อผู้ใช้งานระบบทั้งหมด (สำหรับ Admin) | 🔒 |
| **GET** | `/api/users/{id}` | ดูรายละเอียดข้อมูลโปรไฟล์ผู้ใช้งานตาม ID | 🔒 |
| **PUT** | `/api/users/{id}` | แก้ไขข้อมูลรายละเอียดผู้ใช้งาน | 🔒 |
| **DELETE** | `/api/users/{id}` | ลบบัญชีผู้ใช้งานออกจากระบบ | 🔒 |
| **PUT** | `/api/users/{id}/status` | อัปเดตสถานะการระงับหรือเปิดใช้งานบัญชีผู้ใช้งาน | 🔒 |