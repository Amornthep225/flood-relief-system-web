# Flood Relief Management System (ระบบบริหารจัดการความช่วยเหลือผู้ประสบภัยน้ำท่วม)

ระบบบริหารจัดการกระบวนการช่วยเหลือผู้ประสบภัยน้ำท่วมแบบครบวงจร ตั้งแต่การแจ้งขอความช่วยเหลือ (SOS) การจัดการข้อมูลผู้ประสบภัย การตรวจสอบคำร้อง การจัดสรรสิ่งของช่วยเหลือ การติดตามสถานะคำขอในรูปแบบ Timeline และการบริหารงานของเจ้าหน้าที่ โดยมีการควบคุมสิทธิ์การใช้งานตามบทบาท (Role-Based Access Control) เพื่อความปลอดภัยและความโปร่งใสในการดำเนินงาน

---

## 🎯 วัตถุประสงค์ของโครงการ (Project Objectives)
* เพิ่มประสิทธิภาพในการรับแจ้งเหตุและระบุพิกัดผู้ประสบภัยได้อย่างแม่นยำ
* ลดขั้นตอนการประสานงานที่ซ้ำซ้อนระหว่างผู้ประสบภัยและเจ้าหน้าที่ภาคสนาม
* สามารถติดตามสถานะการช่วยเหลือได้แบบเป็นขั้นตอน (Real-time Tracking Phase)
* จัดเก็บข้อมูลคำขอความช่วยเหลือและสถิติอย่างเป็นระบบ
* สนับสนุนการบริหารจัดการสิ่งของบริจาคและคลังสิ่งของบรรเทาทุกข์
* เพิ่มความโปร่งใสและตรวจสอบได้ในทุกกระบวนการดำเนินงาน

---

## 👥 บทบาทผู้ใช้งานระบบ (System Users)

ระบบแบ่งผู้ใช้งานออกเป็น 4 ส่วนหลัก (Role-Based Access Control):

1. **ผู้ประสบภัย (User)**
   * สมัครสมาชิก / เข้าสู่ระบบ / แก้ไขข้อมูลส่วนตัว
   * แจ้งขอความช่วยเหลือด่วน (SOS) พร้อมระบุพิกัดตำแหน่ง (Latitude, Longitude) ผ่านแอปพลิเคชัน
   * เลือกรายการสิ่งของและจำนวนที่จำเป็น พร้อมใส่หมายเหตุเพิ่มเติม
   * ติดตามสถานะคำขอผ่านระบบ Timeline และดูประวัติการร้องขอทั้งหมด
   * ยกเลิกคำขอความช่วยเหลือ (ตามเงื่อนไขที่ระบบกำหนด)

2. **ผู้บริจาค (Donor)**
   * สมัครสมาชิกผู้บริจาค / เข้าสู่ระบบ
   * ดูรายการสิ่งของบรรเทาทุกข์ที่ระบบกำลังเปิดรับบริจาค
   * แจ้งความประสงค์บริจาคสิ่งของ (ระบุประเภทและจำนวน) พร้อมติดตามสถานะการรับมอบ
   * *หมายเหตุ: ระบบนี้รองรับเฉพาะการบริจาคสิ่งของ (In-kind Donation) เท่านั้น ไม่รองรับการบริจาคในรูปแบบเงิน*

**ผู้บริจาคและผู่ขอความช่วยเหือล็อกอินด้วยตารางเดียวกันแต่แบ่งโรล**

3. **เจ้าหน้าที่ช่วยเหลือ (Staff)**
   * เข้าสู่ระบบเจ้าหน้าที่เพื่อจัดการงานภาคสนาม
   * ดูรายการคำขอความช่วยเหลือ (SOS Requests) ในพื้นที่รับผิดชอบ
   * กดรับผิดชอบคำขอ ติดต่อผู้ประสบภัย และอัปเดตสถานะการดำเนินงาน 6 สถานะ:
     `Pending` (ส่งคำขอแล้ว) → `Accepted` (รับเรื่องแล้ว) → `Preparing` (กำลังจัดเตรียมสิ่งของ) → `Delivering` (กำลังเดินทาง) → `Completed` (ช่วยเหลือสำเร็จ) หรือ `Cancelled` (คำขอถูกยกเลิก)

4. **ผู้ดูแลระบบ (Admin)**
   * จัดการผู้ใช้งานและสิทธิ์ในระบบ (User & Staff Management)
   * ตรวจสอบความถูกต้องของคำขอความช่วยเหลือและข้อมูลการบริจาค
   * จัดการคลังสิ่งของ (ประเภทสิ่งของ และรายการสิ่งของบรรเทาทุกข์)
   * ดู Dashboard ข้อมูลสรุปภาพรวมของระบบเพื่อการบริหารจัดการเชิงนโยบาย

---

## 🛠️ เทคโนโลยีที่ใช้ (Technology Stack)

### Frontend
* **Framework:** Next.js (App Router)
* **Language:** JavaScript / JSX
* **Styling:** Tailwind CSS
* **Icons:** Material Symbols
* **Map Engine:** React Leaflet + OpenStreetMap (สำหรับแสดงพิกัดผู้ประสบภัยและวางแผนเส้นทาง)
* **Alert System:** SweetAlert2

### Backend
* **Framework:** ASP.NET Core Web API
* **Language:** C#
* **ORM:** Entity Framework Core (EF Core)
* **Database:** SQL Server
* **Authentication:** JWT Authentication (ส่งผ่าน `Authorization: Bearer {token}` ใน HTTP Header)


## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
├── frontend/
│   ├── app/          # Next.js App Router (Pages & Routing)
│   ├── components/   # Reusable UI Components (Map, Timeline, Navbar)
│   ├── services/     # API Service calls (Axios/Fetch integration)
│   ├── constants/    # App constants (Status configs, App config)
└── backend/
    ├── Controllers/  # API Endpoints handling HTTP Requests
    ├── Services/     # Business Logic Layer
    ├── Models/       # Database Entities (EF Core)
    ├── DTOs/         # Data Transfer Objects
    ├── Data/         # Data Context (ApplicationDbContext) & Migrations
    └── Middleware/   # Custom Middlewares (JWT, Error Handling)


ขั้นตอนการติดตั้งและเริ่มใช้งาน (Installation & Setup)
ติดตั้ง Dependencies:

Bash
npm install
รันโปรเจกต์ในโหมดพัฒนา (Development Mode):

Bash
npm run dev

ส่วนที่เสร็จสมบูรณ์แล้ว (Completed)
ระบบยืนยันตัวตนและการสมัครสมาชิก (User Authentication & Registration)

ระบบสร้างคำขอความช่วยเหลือ (SOS Request)

ระบบติดตามสถานะคำขอในรูปแบบภาพ (SOS Tracking Timeline)

ระบบแผนที่ระบุพิกัด (Location Map via Leaflet)

ระบบรักษาความปลอดภัยและการตรวจสอบสิทธิ์ (JWT Authentication & Role Permission)

⏳ อยู่ระหว่างการพัฒนา (In Progress)
ระบบจัดการสำหรับเจ้าหน้าที่ภาคสนาม (Staff Dashboard)

ระบบจัดการภาพรวมสำหรับผู้ดูแลระบบ (Admin Dashboard)

ระบบบริหารคลังและการรับของบริจาค (Donation & Stock Management)

ระบบแจ้งเตือนภายในแอปพลิเคชัน (Notification System)


AI Assistant: ใช้ปัญญาประดิษฐ์ช่วยคัดกรองข้อมูล คาดเดาความเสียหาย และจัดลำดับความเร่งด่วนของเคสโดยอัตโนมัติ

Flood Analysis: ระบบวิเคราะห์พิกัดเพื่อแสดงผลพื้นที่น้ำท่วมซ้ำซาก (Heatmap) ช่วยในการวางแผนแจกจ่ายถุงยังชีพ

👨‍💻 พัฒนาโดย
Project Type: Academic Project (โครงการเพื่อการศึกษา)

Tech Stack: Next.js + ASP.NET Core Web API + SQL Server

License: Developed for educational purposes.