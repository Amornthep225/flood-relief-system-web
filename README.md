# Flood Relief Management System

ระบบบริหารจัดการความช่วยเหลือผู้ประสบภัยน้ำท่วม (Flood Relief Management System)

ระบบสำหรับบริหารกระบวนการช่วยเหลือผู้ประสบภัย ตั้งแต่การแจ้งเหตุ SOS การติดตามสถานะ การขอรับสิ่งของ การบริจาค การจัดการคลังสินค้า และการทำงานของ User, Staff และ Admin

## Current Features

- Authentication และ JWT
- User / Staff / Admin Role Permission
- SOS Request และ Tracking Timeline
- Staff รับงานและเปลี่ยนสถานะ SOS
- คำขอรับสิ่งของ
- การอนุมัติสิ่งของแบบบางส่วน (Partial Approval)
- แสดงจำนวนที่ขอและจำนวนที่อนุมัติ
- ตัด Stock ตามจำนวนที่อนุมัติจริง
- Donation Management
- Inventory Management
- Inventory Transaction
- Low Stock Management
- Admin จัดการข้อมูลระบบ

## Technology Stack

### Frontend
- Next.js App Router
- JavaScript JSX
- Tailwind CSS
- React Leaflet
- SweetAlert2

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- MySQL
- JWT Authentication

## Project Structure

frontend/
- app/
- components/
- services/
- constants/
- public/

backend/
- Controllers/
- Services/
- Models/
- DTOs/
- Data/
- Migrations/
- Middleware/

## Documentation

- API.md : API Reference
- DATABASE.md : Database Structure
- SYSTEM_FLOW.md : System Flow
- TODO.md : Development Status

## Development

Frontend:
npm install
npm run dev

Frontend:
http://localhost:3000

Backend:
http://localhost:7000

