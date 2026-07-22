# TODO
## AI-Readable Development Plan

เอกสารนี้ใช้เป็นแผนพัฒนาหลักสำหรับ Developer และ AI Assistant

---

## วิธีอ่านสถานะ

- `[x]` เสร็จแล้วและทดสอบ flow หลักแล้ว
- `[~]` ทำบางส่วน แต่ยังไม่ครบ Acceptance Criteria
- `[ ]` ยังไม่ได้ทำ
- `[!]` ต้องแก้บั๊กหรือทบทวนก่อนทำงานอื่น
- `[?]` ต้องตรวจสอบกับโค้ดจริงก่อนสรุป

Priority:

- `P0` Critical: กระทบข้อมูล ความปลอดภัย หรือ flow หลัก
- `P1` High: จำเป็นต่อ MVP
- `P2` Medium: เพิ่มความสมบูรณ์
- `P3` Future: ทำภายหลัง

---

# 1. Completed Features

## Authentication

- [x] User Register
- [x] User Login
- [x] Staff Login
- [x] Admin Login
- [x] JWT Token
- [x] Role Permission เบื้องต้น

## User / SOS

- [x] สร้าง SOS Request
- [x] บันทึกพิกัด Latitude/Longitude
- [x] เพิ่ม SosRequestItems
- [x] ดู SOS History
- [x] ดู SOS Detail
- [x] Tracking Timeline
- [x] Cancel SOS ตามเงื่อนไข
- [x] Assign Staff
- [x] เปลี่ยนสถานะ `Pending → Accepted`
- [x] เปลี่ยนสถานะ `Accepted → Preparing`
- [x] เปลี่ยนสถานะ `Preparing → Delivering`
- [x] เปลี่ยนสถานะ `Delivering → Completed`

## Donation

- [x] สร้าง Donation
- [x] Donation Items
- [x] Donation History ของ Donor
- [x] Receive Donation เข้าคลัง
- [x] สร้าง Transaction ประเภท `DonationIn`
- [x] อัปเดต Donation เป็น Received

## Inventory

- [x] CenterInventory
- [x] InventoryTransaction
- [x] Stock In
- [x] Stock Out
- [x] Low Stock Endpoint
- [x] Transaction History
- [x] ตัดสต็อกจาก SOS ตอน `Delivering`
- [x] สร้าง Transaction ประเภท `SOSOut`
- [x] หน้า Low Products เชื่อม API
- [x] แยก Service `services/user/lowProducts.js`
- [x] แยก Low Products UI เป็น Components

---

# 2. P0 — Data Integrity and Security

## 2.1 Prevent Duplicate Inventory Processing

- [ ] เพิ่ม idempotency ป้องกัน Receive Donation ซ้ำ
- [ ] เพิ่ม idempotency ป้องกัน SOSOut ซ้ำ
- [ ] เพิ่ม Unique Index ที่เหมาะสมใน InventoryTransactions
- [ ] ตรวจสอบ concurrent request ด้วย transaction/locking
- [ ] ทดสอบยิง request ซ้ำพร้อมกัน

Acceptance Criteria:

- Donation เดิมรับเข้าคลังครั้งที่สองไม่ได้
- SOS เดิมตัดสต็อกครั้งที่สองไม่ได้
- API ต้องตอบ error ที่อ่านเข้าใจได้
- จำนวนในคลังและ Transaction ต้องไม่ซ้ำ

## 2.2 Database Transaction

- [ ] ตรวจว่า Receive Donation ครอบด้วย EF Core Transaction
- [ ] ตรวจว่า Delivering SOS ครอบด้วย EF Core Transaction
- [ ] Rollback เมื่อ item ใด item หนึ่งไม่พอ
- [ ] Rollback เมื่อสร้าง Transaction ไม่สำเร็จ
- [ ] เพิ่ม Integration Test สำหรับ rollback

## 2.3 Authorization

- [x] กำหนด Policy แยก Admin, Staff, User/Donor
- [ ] Staff เห็นและแก้ข้อมูลเฉพาะ Center ของตัวเอง
- [x] User อ่านได้เฉพาะ SOS และ Donation ของตัวเอง
- [ ] Admin เข้าถึงข้อมูลข้าม Center ได้
- [x] ตรวจ JWT Expiration
- [ ] เพิ่ม Refresh Token หรือกำหนด logout เมื่อ token หมดอายุ
- [ ] ห้ามเปิด Admin Register ใน Production

## 2.4 Input Validation

- [ ] Quantity ต้องมากกว่า 0
- [ ] MinimumQuantity ห้ามติดลบ
- [ ] PhoneNumber และ Email validation
- [ ] Latitude/Longitude validation
- [ ] Status transition validation ที่ Backend
- [ ] จำกัดความยาว Remark/Description
- [ ] ป้องกัน duplicate email/username

---

# 3. P1 — Staff Module

## 3.1 Staff Dashboard

- [ ] สร้าง Staff Dashboard Overview
- [ ] แสดง Pending SOS ของ Center
- [ ] แสดงงานที่ Staff รับผิดชอบ
- [ ] แสดงจำนวนงานตาม Status
- [ ] แสดง Low Stock Summary
- [ ] แสดง Donation รอรับ
- [ ] เพิ่ม Loading, Error และ Empty State

Acceptance Criteria:

- Staff Login แล้วเห็นข้อมูลเฉพาะ Center ตัวเอง
- ตัวเลข Dashboard ตรงกับ API
- กดจาก Summary ไปหน้ารายละเอียดได้

## 3.2 SOS Work Queue

- [ ] Filter ตาม Status
- [ ] Search จาก SOS ID, ชื่อ User หรือเบอร์โทร
- [ ] Sort ตาม Priority และ CreatedAt
- [ ] ปุ่ม Accept/Assign
- [ ] ปุ่ม Preparing
- [ ] ปุ่ม Delivering พร้อม Stock Validation
- [ ] ปุ่ม Completed
- [ ] แสดงเหตุผลเมื่อเปลี่ยนสถานะไม่ได้
- [ ] Confirm Dialog ก่อนตัด Stock

## 3.3 Staff SOS History

- [ ] หน้าประวัติงาน Staff
- [ ] Filter ตามวันที่
- [ ] Filter ตาม Status
- [ ] Detail พร้อม Timeline
- [ ] แสดง Inventory Transactions ที่เกิดจาก SOS
- [ ] Export CSV

---

# 4. P1 — Inventory Module

## 4.1 Inventory Management UI

- [ ] หน้าคลังของ Center
- [ ] Filter ตามหมวดหมู่
- [ ] Search Relief Item
- [ ] แสดง Quantity และ MinimumQuantity
- [ ] Stock In Form
- [ ] Stock Out Form
- [ ] แก้ MinimumQuantity
- [ ] แสดงสถานะ Normal/Low/Out of Stock
- [ ] Confirm Dialog ทุกการเปลี่ยนยอด

## 4.2 Transaction History UI

- [ ] ตาราง Transaction
- [ ] Filter TransactionType
- [ ] Filter Center
- [ ] Filter ReliefItem
- [ ] Filter Date Range
- [ ] แสดง ReferenceId
- [ ] Link ไป Donation/SOS ต้นทาง
- [ ] Pagination
- [ ] Export CSV/PDF

## 4.3 Low Products Improvements

- [ ] ตรวจ field mapping จาก response จริง
- [ ] กรอง Center ผ่าน query parameter
- [ ] Category Filter จาก ReliefCategory
- [ ] ส่ง ReliefItemId และ CenterId ไป Donation Form
- [ ] Prefill รายการบริจาค
- [ ] แสดงจำนวนขาดอย่างถูกต้อง
- [ ] แสดง Out of Stock แยกจาก Low Stock
- [ ] Responsive Mobile
- [ ] Retry Button เมื่อ API error

Acceptance Criteria:

- ไม่มี Mock Data
- ไม่มี `fetch()` ใน UI Component
- API call อยู่ใน Service
- เปลี่ยน Center แล้วโหลดข้อมูลถูกต้อง
- Link บริจาคเปิดฟอร์มพร้อม item/center ที่เลือก

---

# 5. P1 — Donation Module

## 5.1 Donor Form

- [ ] เลือก Center
- [ ] เลือกหลาย Relief Items
- [ ] Quantity แยกต่อ Item
- [ ] ตรวจหน่วยให้ตรงกับ ReliefItem
- [ ] อัปโหลดรูป
- [ ] Review ก่อน Submit
- [ ] Success Page พร้อม Donation ID

## 5.2 Donation Management for Staff

- [ ] รายการ Donation ของ Center
- [ ] Filter ตาม Status
- [ ] ดู Donation Detail
- [ ] ตรวจจำนวนที่รับจริง
- [ ] Receive Donation
- [ ] ป้องกัน Receive ซ้ำ
- [ ] แสดง Transaction หลังรับ
- [ ] รองรับ Partial Receive หรือกำหนดชัดเจนว่าไม่รองรับ

## 5.3 Donation Status Definition

- [ ] สรุปสถานะมาตรฐานหนึ่งชุด
- [ ] อัปเดต Enum/Constants Backend
- [ ] อัปเดต Constants Frontend
- [ ] อัปเดต API.md และ SYSTEM_FLOW.md
- [ ] Migration ข้อมูลสถานะเก่า หากจำเป็น

---

# 6. P1 — Admin Module

## 6.1 Admin Dashboard

- [ ] SOS Summary
- [ ] Donation Summary
- [ ] Inventory Summary
- [ ] Low Stock by Center
- [ ] Active Cases Map
- [ ] Daily/Weekly/Monthly Chart
- [ ] Top Requested Items
- [ ] Top Donated Items

## 6.2 User Management

- [ ] List Users
- [ ] Search/Filter
- [ ] View Detail
- [ ] Activate/Deactivate
- [ ] Edit User
- [ ] Audit Admin Action
- [ ] Pagination

## 6.3 Staff Management

- [ ] List Staff
- [ ] Create Staff
- [ ] Assign Center
- [ ] Edit Staff
- [ ] Activate/Deactivate
- [ ] Staff Performance Summary
- [ ] Audit Admin Action

## 6.4 Master Data

- [ ] CRUD Centers
- [ ] CRUD Relief Categories
- [ ] CRUD Relief Items
- [ ] Soft Delete แทน Hard Delete
- [ ] ป้องกันลบข้อมูลที่ถูกใช้งาน
- [ ] Validation ของชื่อซ้ำและ Unit

---

# 7. P2 — Notification and Real-time

## 7.1 In-App Notification

- [ ] ออกแบบ Notifications table
- [ ] แจ้ง Staff เมื่อมี SOS ใหม่
- [ ] แจ้ง User เมื่อสถานะเปลี่ยน
- [ ] แจ้ง Donor เมื่อรับของแล้ว
- [ ] Mark as Read
- [ ] Unread Count
- [ ] Notification History

## 7.2 SignalR

- [ ] เพิ่ม SignalR Hub
- [ ] SOS Status Update แบบ Real-time
- [ ] Dashboard refresh แบบ Real-time
- [ ] Low Stock Alert
- [ ] Reconnect Handling
- [ ] Authorization ใน Hub

---

# 8. P2 — Reports and Analytics

- [ ] SOS Report ตามช่วงเวลา
- [ ] Donation Report ตาม Center
- [ ] Inventory Movement Report
- [ ] Low Stock Report
- [ ] Staff Performance Report
- [ ] Export CSV
- [ ] Export PDF
- [ ] Dashboard Charts
- [ ] Date Range Filter
- [ ] Timezone consistency

---

# 9. P2 — Maps and Routing

- [ ] แสดง SOS ทั้งหมดบนแผนที่ Staff/Admin
- [ ] สี Marker ตาม Priority
- [ ] เส้นทาง Center → Victim
- [ ] ระยะทางโดยประมาณ
- [ ] Nearby Center Suggestion
- [ ] Cluster Markers
- [ ] Handle Geolocation Permission Denied
- [ ] Manual Pin Selection
- [ ] บันทึกพิกัดด้วย precision ที่เหมาะสม

---

# 10. P2 — Quality

## Backend Tests

- [ ] Unit Test Services
- [ ] Integration Test Controllers
- [ ] Auth/Authorization Tests
- [ ] Inventory Transaction Tests
- [ ] SOS Status Transition Tests
- [ ] Donation Receive Tests
- [ ] Concurrent Stock Tests

## Frontend Tests

- [ ] Component Tests
- [ ] Service Tests
- [ ] Loading/Error/Empty Tests
- [ ] Form Validation Tests
- [ ] E2E: Create SOS
- [ ] E2E: Receive Donation
- [ ] E2E: Deliver SOS

## Code Quality

- [ ] Global Exception Middleware
- [ ] Standard API Response
- [ ] Logging with Correlation ID
- [ ] Remove duplicate `parseResponse()` โดยสร้าง shared helper หากทีมตกลง
- [ ] ESLint/Formatter
- [ ] Nullable Reference Types
- [ ] XML Documentation สำหรับ API สำคัญ

---

# 11. P2 — Deployment

- [ ] แยก Development/Staging/Production config
- [ ] Environment Variables
- [ ] HTTPS
- [ ] CORS เฉพาะ Domain
- [ ] Secret Management
- [ ] MySQL Backup
- [ ] Migration Pipeline
- [ ] Dockerfile Frontend
- [ ] Dockerfile Backend
- [ ] Health Check Endpoint
- [ ] Production Logging
- [ ] Rate Limiting

---

# 12. P3 — Future Features

- [ ] AI ช่วยจัด Priority จากข้อมูล SOS
- [ ] Flood Heatmap
- [ ] Predict Low Stock
- [ ] Recommend Center จากระยะทางและ Stock
- [ ] Route Optimization สำหรับหลาย SOS
- [ ] Offline/PWA Mode
- [ ] SMS/LINE Notification
- [ ] QR Code สำหรับ Donation Tracking
- [ ] Barcode/QR Inventory
- [ ] Multi-language
- [ ] Accessibility Audit

---

# 13. AI Assistant Working Rules

เมื่อ AI ทำงานกับโปรเจกต์นี้ ให้ปฏิบัติตามกฎต่อไปนี้:

1. อ่าน `README.md`, `API.md`, `DATABASE.md`, `SYSTEM_FLOW.md` และ `TODO.md` ก่อนแก้ระบบ
2. ห้ามเดาชื่อ Entity, DTO, Endpoint หรือ Field หากยังไม่เห็นโค้ดจริง
3. ก่อนเพิ่ม API ให้ตรวจ Controller, Service, DTO, Model และ DbContext
4. ก่อนเพิ่ม Database ให้ตรวจ Migration ล่าสุด
5. ใช้ MySQL ไม่ใช่ SQL Server
6. Frontend ใช้ Next.js App Router + JavaScript/JSX
7. API call ต้องอยู่ใน `services/`
8. Service ต้อง import `API_URL` จาก `@/services/config`
9. UI Component ห้ามเรียก `fetch()` โดยตรง
10. ไม่สร้าง `hooks/` folder เว้นแต่ผู้ใช้สั่ง
11. `page.jsx` ต้องสั้นและทำหน้าที่ประกอบ Layout/Page
12. State และ API orchestration อยู่ใน Main Component
13. UI แยกเป็น component ย่อยตาม feature
14. รักษารูปแบบเดียวกับ `DonorHistoryPage` และ `LowProductsPage`
15. ก่อนเปลี่ยน SOS เป็น Delivering ต้องตรวจ Stock
16. ทุก Stock change ต้องมี InventoryTransaction
17. ใช้ Database Transaction เมื่อแก้หลายตาราง
18. ต้องป้องกัน duplicate processing
19. Error message ต้องเป็นภาษาไทยที่ผู้ใช้เข้าใจ
20. หลังทำงานเสร็จให้อัปเดต TODO และเอกสารที่เกี่ยวข้อง

---

# 14. Definition of Done

งานหนึ่งถือว่าเสร็จเมื่อ:

- Backend endpoint ทำงาน
- DTO validation ครบ
- Authorization ถูกต้อง
- Database migration พร้อมเมื่อจำเป็น
- Frontend เรียกผ่าน Service
- มี Loading/Error/Empty State
- ทดสอบ Happy Path
- ทดสอบ Error Path
- ไม่ทำ Stock ติดลบ
- ไม่ประมวลผลซ้ำ
- อัปเดตเอกสาร
