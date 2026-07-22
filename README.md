# Flood Relief Management System

ระบบบริหารจัดการความช่วยเหลือผู้ประสบภัยน้ำท่วม (Flood Relief Management System)

ระบบถูกพัฒนาขึ้นเพื่อช่วยบริหารจัดการกระบวนการช่วยเหลือผู้ประสบภัย ตั้งแต่การแจ้งเหตุฉุกเฉิน (SOS) การติดตามสถานะการช่วยเหลือ การบริจาคสิ่งของ การบริหารคลังของแต่ละศูนย์บรรเทาทุกข์ ไปจนถึงการจัดการข้อมูลโดยเจ้าหน้าที่และผู้ดูแลระบบ

---

## Features

- ระบบ Authentication และ JWT
- ระบบแจ้งเหตุ SOS
- ระบบติดตามสถานะการช่วยเหลือ
- ระบบบริจาคสิ่งของ
- ระบบคลังสินค้า (Inventory)
- ระบบจัดการ Low Stock
- ระบบบันทึก Inventory Transaction
- ระบบจัดการเจ้าหน้าที่ (Staff)
- ระบบจัดการผู้ดูแล (Admin)

---

## Technology Stack

### Frontend

- Next.js (App Router)
- JavaScript (JSX)
- Tailwind CSS
- React Leaflet
- SweetAlert2

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- MySQL
- JWT Authentication

---

## Project Structure

```text
frontend/
├── app/
├── components/
├── services/
├── constants/
└── public/

backend/
├── Controllers/
├── Services/
├── Models/
├── DTOs/
├── Data/
├── Migrations/
└── Middleware/
```

---

# Installation

## 1. Clone Repository

```bash
git clone <repository-url>
```

---

## 2. Frontend


**npm install**


**npm run dev**


Frontend จะทำงานที่


http://localhost:3000

Backend จะทำงานที่

http://localhost:7000






ขึ้นอยู่กับการตั้งค่า Launch Profile

---

## Documentation

รายละเอียดระบบอยู่ในเอกสารต่อไปนี้

- `API.md` — รายการ API ทั้งหมด
- `DATABASE.md` — โครงสร้างฐานข้อมูล
- `SYSTEM_FLOW.md` — ลำดับการทำงานของระบบ
- `TODO.md` — แผนการพัฒนาและงานที่เหลือ

---

## License

This project is developed for educational purposes.