# Database Structure
## Flood Relief Management System

Database Engine: **MySQL**  
ORM: **Entity Framework Core**

> เอกสารนี้อธิบายโครงสร้างเชิงระบบ ควรตรวจสอบชื่อชนิดข้อมูลและ constraint สุดท้ายกับ EF Core Migration ล่าสุด

---

## ความสัมพันธ์หลัก

Geographies 1 ── * Provinces
Provinces 1 ── * Districts
Districts 1 ── * SubDistricts

Provinces 1 ── * Centers
Districts 1 ── * Centers
SubDistricts 1 ── * Centers

Users 1 ── * SosRequests
Users 1 ── * Donations

Centers 1 ── * Staffs
Centers 1 ── * SosRequests
Centers 1 ── * Donations
Centers 1 ── * CenterInventories

SosRequests 1 ── * SosRequestItems
Donations 1 ── * DonationItems

ReliefCategories 1 ── * ReliefItems

ReliefItems 1 ── * SosRequestItems
ReliefItems 1 ── * DonationItems
ReliefItems 1 ── * CenterInventories

CenterInventories 1 ── * InventoryTransactions
```

---

## 1. Users

| Field | Type | Description |
|---|---|---|
| Id | varchar(10) PK | รหัส User |
| FullName | longtext | ชื่อ-นามสกุล |
| PhoneNumber | varchar(10) | เบอร์โทร |
| Email | longtext | อีเมล Login |
| PasswordHash | longtext | Password Hash |
| Role | longtext | `User` หรือ `Donor` |
| IsActive | tinyint(1) | สถานะบัญชี |
| CreatedAt | datetime(6) | วันที่สร้าง |
| UpdatedAt | datetime(6) NULL | วันที่แก้ไข |

---

## 2. Admins

| Field | Type | Description |
|---|---|---|
| Id | varchar(2) PK | รหัส Admin |
| Username | longtext | Username |
| Email | longtext | Email |
| PasswordHash | longtext | Password Hash |
| Role | longtext | `Admin` |
| IsActive | tinyint(1) | สถานะ |
| CreatedAt | datetime(6) | วันที่สร้าง |
| UpdatedAt | datetime(6) NULL | วันที่แก้ไข |

---

## 3. Staffs

| Field | Type | Description |
|---|---|---|
| Id | varchar(5) PK | รหัส Staff |
| CenterId | varchar(5) FK | ศูนย์ที่สังกัด |
| FullName | longtext | ชื่อ-นามสกุล |
| Username | longtext | Username |
| Email | longtext | Email |
| PhoneNumber | varchar(10) | เบอร์โทร |
| PasswordHash | longtext | Password Hash |
| Role | longtext | `Staff` |
| IsActive | tinyint(1) | สถานะ |
| CreatedAt | datetime(6) | วันที่สร้าง |
| UpdatedAt | datetime(6) NULL | วันที่แก้ไข |

---

## 4. Centers

| Field | Type | Description |
|---|---|---|
| Id | varchar(5) PK | รหัสศูนย์ |
| CenterName | varchar(150) | ชื่อศูนย์ |
| Address | varchar(500) | ที่อยู่ |
| ProvinceId | int(11)  | รหัสจังหวัด |
| DistrictId | int(11)  | รหัสอำเภอ/เขต |
| SubDistrictId | int(11)  | รหัสตำบล/แขวง |
| Province | varchar(150) | จังหวัด |
| District | varchar(150) | อำเภอ/เขต |
| SubDistrict | varchar(150) | ตำบล/แขวง |
| ZipCode | varchar(5) | รหัสไปรษณีย์ |
| PhoneNumber | varchar(10) | เบอร์ศูนย์ |
| ContactName | varchar(150) | ผู้ประสานงาน |
| Latitude | double | ละติจูด |
| Longitude | double | ลองจิจูด |
| IsActive | tinyint(1) | สถานะการใช้งาน |
| CreatedAt | datetime(6) | วันที่สร้าง |
| UpdatedAt | datetime(6) NULL | วันที่แก้ไข |

---

## 5. SosRequests

| Field | Type | Description |
|---|---|---|
| Id | varchar(10) PK | รหัส SOS |
| UserId | varchar(10) FK | ผู้แจ้ง |
| CenterId | varchar(5) FK NULL | ศูนย์รับผิดชอบ |
| AssignedStaffId | varchar(5) FK NULL | Staff ที่รับผิดชอบ |
| Latitude | double | Latitude |
| Longitude | double | Longitude |
| AddressDetail | varchar(500) | จุดสังเกต |
| Priority | varchar(20) | `Normal`, `High` ฯลฯ |
| Status | varchar(30) | สถานะงาน |
| UserRemark | varchar(500) NULL | หมายเหตุ User |
| StaffRemark | varchar(500) NULL | หมายเหตุ Staff |
| CreatedAt | datetime(6) | วันที่สร้าง |
| AcceptedAt | datetime(6) NULL | วันที่รับเรื่อง |
| PreparingAt | datetime(6) NULL | วันที่เริ่มเตรียม |
| DeliveringAt | datetime(6) NULL | วันที่เริ่มนำส่ง |
| CompletedAt | datetime(6) NULL | วันที่เสร็จ |
| CancelledAt | datetime(6) NULL | วันที่ยกเลิก |
| UpdatedAt | datetime(6) NULL | วันที่แก้ไข |

Status:

```text
Pending, Accepted, Preparing, Delivering, Completed, Cancelled
```

---

## 6. SosRequestItems

| Field | Type | Description |
|---|---|---|
| Id | varchar(10) PK | รหัสรายการ |
| SosRequestId | varchar(10) FK | SOS |
| ReliefItemId | varchar(10) FK | สิ่งของ |
| Quantity | int | จำนวน |
| Unit | varchar(50) | หน่วย ณ วันที่ร้องขอ |
| CreatedAt | datetime(6) | วันที่สร้าง |

---

## 7. ReliefCategories

| Field | Type | Description |
|---|---|---|
| Id | varchar(5) PK | รหัสหมวด |
| Name | varchar(100) | ชื่อหมวด |
| Icon | varchar(50) | Material Symbol |
| IsActive | tinyint(1) | สถานะ |
| CreatedAt | datetime(6) | วันที่สร้าง |

---

## 8. ReliefItems

| Field | Type | Description |
|---|---|---|
| Id | varchar(10) PK | รหัสสิ่งของ |
| ReliefCategoryId | varchar(5) FK | หมวดหมู่ |
| Name | varchar(150) | ชื่อ |
| Unit | varchar(50) | หน่วยมาตรฐาน |
| IsActive | tinyint(1) | สถานะ |
| CreatedAt | datetime(6) | วันที่สร้าง |

---

## 9. Donations

| Field | Type | Description |
|---|---|---|
| Id | varchar(10) PK | รหัส Donation |
| UserId | varchar(10) FK | Donor |
| CenterId | varchar(5) FK | ศูนย์รับของ |
| DonationType | longtext | ประเภท |
| Description | longtext | รายละเอียด |
| Quantity | int | จำนวนรวม |
| Unit | longtext | หน่วย |
| ImageUrl | longtext NULL | รูปภาพ |
| QRCode | longtext NULL | QR/Tracking |
| Status | longtext | สถานะ |
| CreatedAt | datetime(6) | วันที่สร้าง |
| UpdatedAt | datetime(6) NULL | วันที่แก้ไข |

สถานะที่ควรรองรับ:

```text
Pending, Confirmed, Received, Cancelled
```

---

## 10. DonationItems

| Field | Type | Description |
|---|---|---|
| Id | varchar(10) PK | รหัสรายการ |
| DonationId | varchar(10) FK | Donation |
| ReliefItemId | varchar(10) FK | สิ่งของ |
| Quantity | int | จำนวน |
| Unit | longtext | หน่วย |

---

## 11. CenterInventories

ตารางนี้เก็บยอดคงเหลือของสิ่งของแต่ละชนิดแยกตามศูนย์

| Field | Type | Description |
|---|---|---|
| Id | varchar หรือ char PK | รหัส Inventory |
| CenterId | varchar(5) FK | ศูนย์ |
| ReliefItemId | varchar(10) FK | สิ่งของ |
| Quantity | int | จำนวนคงเหลือ |
| MinimumQuantity | int | จุดแจ้งเตือน Low Stock |
| CreatedAt | datetime(6) | วันที่สร้าง |
| UpdatedAt | datetime(6) NULL | วันที่เปลี่ยนยอดล่าสุด |

Constraint สำคัญ:

```text
UNIQUE (CenterId, ReliefItemId)
CHECK Quantity >= 0
CHECK MinimumQuantity >= 0
```

Low Stock Condition:

```text
Quantity <= MinimumQuantity
```

จำนวนที่ขาด:

```text
MissingQuantity = max(MinimumQuantity - Quantity, 0)
```

---

## 12. InventoryTransactions

ตาราง Audit Log ของการเปลี่ยนแปลงสต็อกทุกครั้ง

| Field | Type | Description |
|---|---|---|
| Id | varchar หรือ char PK | รหัส Transaction |
| CenterInventoryId | FK | Inventory ที่เปลี่ยน |
| CenterId | varchar(5) FK | ศูนย์ |
| ReliefItemId | varchar(10) FK | สิ่งของ |
| TransactionType | varchar(30) | ประเภทรายการ |
| Quantity | int | จำนวนที่เปลี่ยน |
| QuantityBefore | int NULL | ยอดก่อนทำรายการ |
| QuantityAfter | int NULL | ยอดหลังทำรายการ |
| ReferenceType | varchar(30) NULL | เช่น `Donation`, `SOS`, `Manual` |
| ReferenceId | varchar NULL | Id ของ Donation หรือ SOS |
| Note | varchar(500) NULL | หมายเหตุ |
| CreatedByStaffId | varchar(5) FK NULL | Staff ผู้ดำเนินการ |
| CreatedAt | datetime(6) | วันที่สร้าง |

Transaction Type:

```text
StockIn
StockOut
DonationIn
SOSOut
```


กฎ:

- ห้ามแก้ไขหรือลบ Transaction หลังสร้าง ยกเว้นมีระบบ reversal
- การเปลี่ยน Quantity ต้องทำพร้อม Transaction ใน Database Transaction เดียว
- `DonationIn` ต้องผูกกับ Donation
- `SOSOut` ต้องผูกกับ SOS
- ควรมี Unique Index ป้องกันการประมวลผล Reference ซ้ำ


## 13. Geographies 
| Field  |    Type   | Description |
| Id     |   int(11) PK  |   รหัสภูมิภาค  |
| Name |  varchar(255)  |  ชื่อภาษาไทย |

## 14. Provinces

| Field        | Type         | Description                         |
|--------------|--------------|-------------------------------------|
| id           | int(11) PK   | รหัสจังหวัด                         |
| name_th      | varchar(150) | ชื่อจังหวัดภาษาไทย                  |
| name_en      | varchar(150) | ชื่อจังหวัดภาษาอังกฤษ               |
| geography_id | int(11)      | รหัสภูมิภาค                         |
| created_at   | datetime(6)  | วันที่และเวลาที่สร้างข้อมูล         |
| updated_at   | datetime(6)  | วันที่และเวลาที่แก้ไขข้อมูลล่าสุด   |
| deleted_at   | datetime(6)  | วันที่และเวลาที่ลบข้อมูลแบบ Soft Delete |

กฎ:
- `id` เป็น Primary Key และ Auto Increment
- `name_th`, `name_en` และ `geography_id` ห้ามเป็นค่าว่าง
- `geography_id` ใช้เชื่อมโยงกับตาราง `Geographies`
- `created_at`, `updated_at` และ `deleted_at` สามารถเป็น `NULL` ได้
- เมื่อ `deleted_at` มีค่า หมายถึงข้อมูลถูกลบแบบ Soft Delete

## 15. districts

| Field       | Type         | Description                              |
|-------------|--------------|------------------------------------------|
| id          | int(11) PK   | รหัสอำเภอ                                |
| name_th     | varchar(150) | ชื่ออำเภอภาษาไทย                         |
| name_en     | varchar(150) | ชื่ออำเภอภาษาอังกฤษ                      |
| province_id | int(11) FK   | รหัสจังหวัด อ้างอิง `Provinces.id`       |
| created_at  | datetime(6)  | วันที่และเวลาที่สร้างข้อมูล              |
| updated_at  | datetime(6)  | วันที่และเวลาที่แก้ไขข้อมูลล่าสุด        |
| deleted_at  | datetime(6)  | วันที่และเวลาที่ลบข้อมูลแบบ Soft Delete |


กฎ:
- `id` เป็น Primary Key และ Auto Increment
- `name_th`, `name_en` และ `province_id` ห้ามเป็นค่าว่าง
- `province_id` ใช้เชื่อมโยงกับ `Provinces.id`
- `created_at`, `updated_at` และ `deleted_at` สามารถเป็น `NULL` ได้
- เมื่อ `deleted_at` มีค่า หมายถึงข้อมูลถูกลบแบบ Soft Delete

## 16. Sub_Districts

| Field       | Type         | Description                              |
|-------------|--------------|------------------------------------------|
| id          | int(11) PK   | รหัสตำบล                                 |
| zip_code    | int(11)      | รหัสไปรษณีย์                             |
| name_th     | varchar(150) | ชื่อตำบลภาษาไทย                          |
| name_en     | varchar(150) | ชื่อตำบลภาษาอังกฤษ                       |
| district_id | int(11) FK   | รหัสอำเภอ อ้างอิง `Districts.id`         |
| lat         | double       | ค่าละติจูด                               |
| long        | double       | ค่าลองจิจูด                              |
| created_at  | datetime(6)  | วันที่และเวลาที่สร้างข้อมูล              |
| updated_at  | datetime(6)  | วันที่และเวลาที่แก้ไขข้อมูลล่าสุด        |
| deleted_at  | datetime(6)  | วันที่และเวลาที่ลบข้อมูลแบบ Soft Delete |

กฎ:
- `id` เป็น Primary Key และ Auto Increment
- `zip_code`, `name_th`, `name_en` และ `district_id` ห้ามเป็นค่าว่าง
- `district_id` ใช้เชื่อมโยงกับ `Districts.id`
- `lat`, `long`, `created_at`, `updated_at` และ `deleted_at` สามารถเป็น `NULL` ได้
- เมื่อ `deleted_at` มีค่า หมายถึงข้อมูลถูกลบแบบ Soft Delete

## Database Transaction Requirements

กระบวนการต่อไปนี้ต้องครอบด้วย EF Core Database Transaction:

### Receive Donation

```text
Update CenterInventory
+ Insert InventoryTransaction(DonationIn)
+ Update Donation.Status
```

### Deliver SOS

```text
Validate all requested items
+ Update CenterInventory
+ Insert InventoryTransaction(SOSOut)
+ Update SosRequest.Status
```

หากรายการใดล้มเหลว ต้อง Rollback ทั้งชุด
