# System Flow
## Flood Relief Management System

---

## 1. Actors และสิทธิ์

| Actor | หน้าที่หลัก |
|---|---|
| User/Victim | แจ้ง SOS และติดตามสถานะ |
| Donor | บริจาคสิ่งของและดูความต้องการของศูนย์ |
| Staff | รับงาน SOS, อัปเดตสถานะ, รับบริจาค, จัดการคลัง |
| Admin | จัดการ Master Data, Users, Staffs และ Dashboard |

User และ Donor อยู่ในตาราง `Users` เดียวกันและแยกด้วย `Role`

---

## 2. Authentication Flow

```text
Register/Login
  ↓
Backend ตรวจสอบข้อมูล
  ↓
สร้าง JWT
  ↓
Frontend เก็บ Token
  ↓
เรียก API ด้วย Authorization: Bearer
  ↓
Backend ตรวจ Role/Policy
```

---

## 3. SOS Flow

### 3.1 User สร้างคำขอ

1. User เปิดหน้า SOS
2. ระบบอ่านพิกัด Latitude/Longitude
3. User กรอกรายละเอียดสถานที่ หมายเหตุ และรายการสิ่งของ
4. Backend สร้าง `SosRequest`
5. Backend สร้าง `SosRequestItems`
6. สถานะเริ่มต้นเป็น `Pending`

### 3.2 Staff รับและดำเนินงาน

```text
Pending
  ↓ assign
Accepted
  ↓ update status
Preparing
  ↓ update status
Delivering
  ↓ update status
Completed
```

`Cancelled` เป็นสถานะปลายทางกรณียกเลิก

### 3.3 Inventory Integration ตอน Delivering

เมื่อ Staff เปลี่ยน SOS เป็น `Delivering`:

1. โหลดรายการ `SosRequestItems`
2. ตรวจว่า SOS มี `CenterId`
3. ตรวจคลังของศูนย์ทุกชิ้น
4. หากชิ้นใดไม่พอ ให้ยกเลิกทั้งกระบวนการ
5. ตัดยอดใน `CenterInventories`
6. สร้าง `InventoryTransactions` ประเภท `SOSOut`
7. บันทึก `DeliveringAt`
8. Commit Database Transaction

ระบบต้องป้องกันการตัดซ้ำเมื่อเรียก endpoint เดิมหลายครั้ง

### 3.4 User Tracking

User ดู:

- สถานะปัจจุบัน
- Timeline
- Staff/Center ที่รับผิดชอบ
- รายการสิ่งของ
- วันที่ Accepted, Preparing, Delivering และ Completed

---

## 4. Donation Flow

### 4.1 Donor สร้าง Donation

1. Donor เลือกศูนย์
2. เลือกรายการและจำนวน
3. Backend สร้าง `Donation`
4. Backend สร้าง `DonationItems`
5. Donor ดูสถานะจาก Donation History

### 4.2 Staff รับของเข้าคลัง

```text
Donation Pending
  ↓ Staff ตรวจรับ
Receive Donation
  ↓
CenterInventory เพิ่ม
  ↓
InventoryTransaction(DonationIn)
  ↓
Donation = Received
```

ทุกขั้นตอนต้องอยู่ใน Database Transaction เดียว และห้ามรับซ้ำ

---

## 5. Inventory Flow

### 5.1 Stock In

```text
Staff ส่ง CenterId + ReliefItemId + Quantity
  ↓
Validate
  ↓
เพิ่ม CenterInventory.Quantity
  ↓
สร้าง InventoryTransaction(StockIn)
```

### 5.2 Stock Out

```text
Staff ส่ง CenterId + ReliefItemId + Quantity
  ↓
Validate Stock
  ↓
ลด CenterInventory.Quantity
  ↓
สร้าง InventoryTransaction(StockOut)
```

Stock Out ห้ามทำให้จำนวนติดลบ

### 5.3 Low Stock

Condition:

```text
Quantity <= MinimumQuantity
```

Frontend:

```text
LowProducts.jsx
  ↓
services/user/lowProducts.js
  ↓
GET /api/centers
GET /api/inventories/low-stock
```

User สามารถ:

- ดูของขาดแคลนทุกศูนย์
- กรองตามศูนย์
- ดูจำนวนคงเหลือ
- ดูจำนวนที่ขาด
- ดู Progress เทียบ Minimum Quantity
- ไปยังหน้าบริจาครายการนั้น

### 5.4 Transaction History

ทุกการเปลี่ยนสต็อกต้องสร้าง Transaction:

```text
StockIn
StockOut
DonationIn
SOSOut
```

Transaction ใช้สำหรับ Audit และตรวจสอบย้อนหลัง

---

## 6. Frontend Data Flow

```text
page.jsx
  ↓
Main Component
  ↓
Service Function
  ↓
fetch(API_URL)
  ↓
parseResponse()
  ↓
setState()
  ↓
UI Component
```

มาตรฐานปัจจุบัน:

- API URL มาจาก `@/services/config`
- API call อยู่ใน `services/`
- Component ไม่เรียก fetch โดยตรง
- Main Component จัดการ state/loading/error
- UI component รับ props และแสดงผล
- ไม่ใช้ hooks folder แยก

---

## 7. Critical Business Rules

1. ห้ามอัปเดต SOS ข้ามลำดับสถานะโดยไม่มีเหตุผล
2. `Completed` และ `Cancelled` เป็นสถานะปลายทาง
3. SOS ต้องตัดสต็อกเพียงครั้งเดียว
4. Donation ต้องรับเข้าคลังเพียงครั้งเดียว
5. Stock ห้ามติดลบ
6. ทุกการเปลี่ยน Stock ต้องมี Transaction
7. การเปลี่ยน Stock และ Transaction ต้อง Commit/Rollback พร้อมกัน
8. Staff ควรจัดการได้เฉพาะข้อมูลของศูนย์ตนเอง
9. Admin จัดการข้อมูลข้ามศูนย์ได้
10. API ต้องตรวจ Role ที่ Backend เสมอ ไม่พึ่ง Frontend
