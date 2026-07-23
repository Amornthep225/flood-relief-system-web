# API Reference
## Flood Relief Management System

Base URL สำหรับ Development:

```text
http://localhost:7000/api
```

API ที่มีสัญลักษณ์ 🔒 ต้องส่ง Header:

```http
Authorization: Bearer {token}
```

> หมายเหตุ: ชื่อ route ของ endpoint ที่เพิ่มใหม่ควรตรวจเทียบกับ Controller จริงก่อน Merge หากมีการเปลี่ยนชื่อในโค้ด

---

## 1. Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| POST | `/api/auth/user-register` | สมัคร User/Donor | ❌ |
| POST | `/api/auth/user-login` | Login User/Donor และรับ JWT | ❌ |
| POST | `/api/auth/staff-register` | สมัคร Staff | ❌ |
| POST | `/api/auth/staff-login` | Login Staff | ❌ |
| POST | `/api/auth/admin-register` | สมัคร Admin | ❌ |
| POST | `/api/auth/admin-login` | Login Admin | ❌ |

---

## #2. Centers

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| GET | `/api/centers` | รายการศูนย์ทั้งหมด | 🔒 |
| GET | `/api/centers/{id}` | รายละเอียดศูนย์ | 🔒 |
| POST | `/api/centers` | เพิ่มศูนย์ใหม่ | 🔒 |
| PUT | `/api/centers/{id}` | แก้ไขข้อมูลศูนย์ | 🔒 |
| DELETE | `/api/centers/{id}` | ปิดใช้งานศูนย์ | 🔒 |

---

## 3. Relief Categories

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| GET | `/api/relief-categories` | รายการหมวดหมู่ทั้งหมด | 🔒 |
| GET | `/api/relief-categories/active` | หมวดหมู่ที่เปิดใช้งาน | 🔒 |
| GET | `/api/relief-categories/{id}` | รายละเอียดหมวดหมู่ | 🔒 |
| POST | `/api/relief-categories` | เพิ่มหมวดหมู่ | 🔒 |
| PUT | `/api/relief-categories/{id}` | แก้ไขหมวดหมู่ | 🔒 |
| PUT | `/api/relief-categories/{id}/status` | เปิด/ปิดใช้งาน | 🔒 |
| DELETE | `/api/relief-categories/{id}` | ลบหมวดหมู่ | 🔒 |

---

## 4. Relief Items

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| GET | `/api/relief-items` | รายการสิ่งของทั้งหมด | 🔒 |
| GET | `/api/relief-items/active` | รายการที่เปิดใช้งาน | 🔒 |
| GET | `/api/relief-items/category/{categoryId}` | รายการตามหมวดหมู่ | 🔒 |
| GET | `/api/relief-items/{id}` | รายละเอียดสิ่งของ | 🔒 |
| POST | `/api/relief-items` | เพิ่มสิ่งของ | 🔒 |
| PUT | `/api/relief-items/{id}` | แก้ไขสิ่งของ | 🔒 |
| PUT | `/api/relief-items/{id}/status` | เปิด/ปิดใช้งาน | 🔒 |
| DELETE | `/api/relief-items/{id}` | ลบสิ่งของ | 🔒 |

---

## 5. SOS Requests

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| POST | `/api/sos-requests` | สร้างคำขอ SOS | 🔒 |
| GET | `/api/sos-requests` | รายการ SOS ทั้งระบบ | 🔒 |
| GET | `/api/sos-requests/my` | คำขอของ User ปัจจุบัน | 🔒 |
| GET | `/api/sos-requests/my-requests` | ประวัติคำขอของ User | 🔒 |
| GET | `/api/sos-requests/{id}` | รายละเอียดและ Timeline | 🔒 |
| GET | `/api/sos-requests/pending` | รายการ Pending | 🔒 |
| GET | `/api/sos-requests/staff/me` | งานของ Staff ปัจจุบัน | 🔒 |
| GET | `/api/sos-requests/center/{centerId}` | SOS แยกตามศูนย์ | 🔒 |
| GET | `/api/sos-requests/statistics` | สถิติ SOS | 🔒 |
| PUT | `/api/sos-requests/{id}/assign` | มอบหมาย Staff และเปลี่ยนเป็น Accepted | 🔒 |
| PUT | `/api/sos-requests/{id}/status` | อัปเดตสถานะ SOS | 🔒 |
| PUT | `/api/sos-requests/{id}/cancel` | ยกเลิกคำขอ | 🔒 |

### กฎของ Status

```text
Pending → Accepted → Preparing → Delivering → Completed
```

`Cancelled` เป็นสถานะปลายทางอีกกรณีหนึ่ง

เมื่ออัปเดตเป็น `Delivering` Backend จะตัดสต็อกและสร้าง Transaction ประเภท `SOSOut`

---

## 6. Donations

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| POST | `/api/Donations` | สร้าง Donation | 🔒 |
| GET | `/api/Donations` | Donation ทั้งหมด | 🔒 |
| GET | `/api/Donations/my` | Donation ของผู้ใช้ปัจจุบัน | 🔒 |
| GET | `/api/Donations/{id}` | รายละเอียด Donation | 🔒 |
| PUT | `/api/Donations/{id}/status` | อัปเดตสถานะ | 🔒 |
| DELETE | `/api/Donations/{id}` | ยกเลิก/ลบ Donation | 🔒 |

### Receive Donation

ระบบรองรับการรับ Donation เข้าคลัง โดย flow ต้องทำงานใน Database Transaction เดียว:

1. ตรวจสอบ Donation และรายการ Donation Items
2. เพิ่มจำนวนใน Center Inventory
3. สร้าง Inventory Transaction ประเภท `DonationIn`
4. อัปเดต Donation เป็น `Received`
5. Rollback ทั้งหมดหากขั้นตอนใดล้มเหลว

> ให้ตรวจชื่อ route รับ Donation จาก `DonationsController` หรือ `InventoriesController` ในโค้ดจริง และบันทึกชื่อ endpoint ที่ตรงกันก่อนส่ง Production

---

## 7. Inventories

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| GET | `/api/inventories` | รายการคลังทั้งหมด หรือกรองตามสิทธิ์ | 🔒 |
| GET | `/api/inventories/center/{centerId}` | คลังของศูนย์ | 🔒 |
| GET | `/api/inventories/low-stock` | รายการที่ต่ำกว่าหรือเท่ากับ Minimum Quantity | ตาม Controller |
| POST | `/api/inventories/stock-in` | เพิ่มสต็อกด้วยรายการปรับปรุงคลัง | 🔒 |
| POST | `/api/inventories/stock-out` | ตัดสต็อกด้วยรายการปรับปรุงคลัง | 🔒 |
| GET | `/api/inventories/transactions` | ประวัติ Stock In/Out, DonationIn และ SOSOut | 🔒 |

### Query Parameter ของ Low Stock

```http
GET /api/inventories/low-stock?centerId=C0001
```

เมื่อไม่ส่ง `centerId` ระบบคืนรายการ Low Stock ทุกศูนย์ตามสิทธิ์ของผู้เรียก

### Transaction Types

| Type | ความหมาย |
|---|---|
| `StockIn` | เจ้าหน้าที่เพิ่มสต็อกทั่วไป |
| `StockOut` | เจ้าหน้าที่ตัดสต็อกทั่วไป |
| `DonationIn` | รับของบริจาคเข้าคลัง |
| `SOSOut` | ตัดสิ่งของเพื่อส่ง SOS |

### Validation ที่จำเป็น

- Quantity ต้องมากกว่า 0
- Center และ Relief Item ต้องมีอยู่จริงและเปิดใช้งาน
- Stock Out ห้ามทำให้ Quantity ติดลบ
- SOSOut ต้องทำได้เพียงครั้งเดียวต่อ SOS
- DonationIn ต้องทำได้เพียงครั้งเดียวต่อ Donation
- ทุกการเปลี่ยนสต็อกต้องมี Inventory Transaction

---

## 8. Staffs

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| GET | `/api/staffs` | รายชื่อ Staff | 🔒 |
| GET | `/api/staffs/{id}` | รายละเอียด Staff | 🔒 |
| GET | `/api/staffs/summary` | สรุปข้อมูล Staff | 🔒 |
| POST | `/api/staffs` | เพิ่ม Staff | 🔒 |
| PUT | `/api/staffs/{id}` | แก้ไข Staff | 🔒 |
| PUT | `/api/staffs/{id}/status` | เปิด/ปิดบัญชี | 🔒 |
| DELETE | `/api/staffs/{id}` | ลบ Staff | 🔒 |

---

## 9. Users

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| GET | `/api/users` | รายชื่อ Users | 🔒 |
| GET | `/api/users/{id}` | รายละเอียด User | 🔒 |
| PUT | `/api/users/{id}` | แก้ไข User | 🔒 |
| PUT | `/api/users/{id}/status` | เปิด/ระงับบัญชี | 🔒 |
| DELETE | `/api/users/{id}` | ลบ User | 🔒 |

---

## #10. Address (Thai Province / District / SubDistrict)

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| GET | `/api/address/provinces` | รายการจังหวัดทั้งหมด | 🔒 |
| GET | `/api/address/districts/{provinceId}` | รายการอำเภอตามจังหวัด | 🔒 |
| GET | `/api/address/sub-districts/{districtId}` | รายการตำบลตามอำเภอ | 🔒 |
| GET | `/api/address/sub-district/{id}` | รายละเอียดตำบลและรหัสไปรษณีย์ | 🔒 |

---

## Standard Error Response

```json
{
  "message": "ข้อความอธิบายข้อผิดพลาด"
}
```

Frontend Service ใช้ `parseResponse()` เพื่ออ่าน `message` และ throw Error ไปยัง Main Component
