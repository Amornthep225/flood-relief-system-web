## 🗄️ โครงสร้างฐานข้อมูล (Database Structure)

### 1. ตาราง Users (ข้อมูลผู้ใช้งานทั่วไป / ผู้ประสบภัย / ผู้บริจาค)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(10) (PK) | รหัสผู้ใช้งาน |
| **FullName** | longtext | ชื่อ-นามสกุล |
| **PhoneNumber** | varchar(10) | เบอร์โทรศัพท์ติดต่อ |
| **Email** | longtext | อีเมล (ใช้สำหรับ Login) |
| **PasswordHash** | longtext | รหัสผ่านที่เข้ารหัสแล้ว |
| **Role** | longtext | บทบาท (User, Donor) |
| **IsActive** | tinyint(1) (boolean) | สถานะการใช้งานบัญชี (0 = Inactive, 1 = Active) |
| **CreatedAt** | datetime(6) | วันเวลาที่ลงทะเบียน |
| **UpdatedAt** | datetime(6) (Null) | วันเวลาที่อัปเดตข้อมูลล่าสุด (มีค่าเป็น NULL ได้) |

### 2. ตาราง Admins (ข้อมูลผู้ดูแลระบบ)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(2) (PK) | รหัสผู้ดูแลระบบ |
| **Username** | longtext | ชื่อผู้ใช้งานสำหรับ Admin |
| **Email** | longtext | อีเมล |
| **PasswordHash** | longtext | รหัสผ่านที่เข้ารหัสแล้ว |
| **Role** | longtext | บทบาท (Admin) |
| **IsActive** | tinyint(1) (boolean) | สถานะการใช้งานบัญชี |
| **CreatedAt** | datetime(6) | วันเวลาที่สร้างบัญชี |
| **UpdatedAt** | datetime(6) (Null) | วันเวลาที่อัปเดตข้อมูลล่าสุด |

### 3. ตาราง Staffs (ข้อมูลเจ้าหน้าที่ช่วยเหลือภาคสนาม)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(5) (PK) | รหัสเจ้าหน้าที่ |
| **CenterId** | varchar(5) (FK) | รหัสศูนย์บรรเทาทุกข์ที่สังกัด (เชื่อมโยงกับ `centers.Id`) |
| **FullName** | longtext | ชื่อ-นามสกุลเจ้าหน้าที่ |
| **Username** | longtext | ชื่อผู้ใช้งาน |
| **Email** | longtext | อีเมล |
| **PhoneNumber** | varchar(10) | เบอร์โทรศัพท์ติดต่อ |
| **PasswordHash** | longtext | รหัสผ่านที่เข้ารหัสแล้ว |
| **Role** | longtext | บทบาท (Staff) |
| **IsActive** | tinyint(1) (boolean) | สถานะการใช้งานบัญชี |
| **CreatedAt** | datetime(6) | วันเวลาที่สร้างบัญชี |
| **UpdatedAt** | datetime(6) (Null) | วันเวลาที่อัปเดตข้อมูลล่าสุด |

### 4. ตาราง Centers (ศูนย์บริหารจัดการ/จุดรับความช่วยเหลือ)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(5) (PK) | รหัสศูนย์บรรเทาทุกข์ |
| **CenterName** | varchar(150) | ชื่อศูนย์บรรเทาทุกข์ |
| **Address** | longtext | ที่อยู่ของศูนย์ |
| **Province** | longtext | จังหวัด |
| **District** | longtext | อำเภอ / เขต |
| **SubDistrict** | longtext | ตำบล / แขวง |
| **ZipCode** | varchar(5) | รหัสไปรษณีย์ |
| **PhoneNumber** | varchar(10) | เบอร์โทรศัพท์ติดต่อของศูนย์ |
| **ContactName** | longtext | ชื่อผู้ประสานงานหลัก |
| **Latitude** | double | พิกัดละติจูดของศูนย์ |
| **Longitude** | double | พิกัดลองจิจูดของศูนย์ |
| **IsActive** | tinyint(1) (boolean) | สถานะการเปิดใช้งานของศูนย์ |
| **CreatedAt** | datetime(6) | วันเวลาที่เพิ่มข้อมูล |
| **UpdatedAt** | datetime(6) (Null) | วันเวลาที่แก้ไขข้อมูลล่าสุด |

### 5. ตาราง SOS Requests (คำขอความช่วยเหลือจากผู้ประสบภัย)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(10) (PK) | รหัสคำขอ SOS |
| **UserId** | varchar(10) (FK) | รหัสผู้แจ้งขอความช่วยเหลือ (เชื่อมโยงกับ `users.Id`) |
| **CenterId** | varchar(5) (FK Null) | รหัสศูนย์ที่รับผิดชอบ (เชื่อมโยงกับ `centers.Id`) |
| **AssignedStaffId**| varchar(5) (FK Null) | รหัสเจ้าหน้าที่ผู้รับผิดชอบงาน (เชื่อมโยงกับ `staffs.Id`) |
| **Latitude** | double | พิกัดละติจูดของผู้แจ้ง |
| **Longitude** | double | พิกัดลองจิจูดของผู้แจ้ง |
| **AddressDetail** | varchar(500) | รายละเอียดสถานที่/จุดสังเกตเพิ่มเติม |
| **Priority** | varchar(20) | ระดับความเร่งด่วน (เช่น Normal, High) |
| **Status** | varchar(30) | สถานะคำขอ (Pending, Accepted, Preparing, Delivering, Completed, Cancelled) |
| **UserRemark** | varchar(500) (Null) | หมายเหตุเพิ่มเติมจากผู้ประสบภัย |
| **StaffRemark** | varchar(500) (Null) | หมายเหตุหรือบันทึกเพิ่มเติมจากเจ้าหน้าที่ |
| **CreatedAt** | datetime(6) | วันเวลาที่สร้างคำขอ |
| **AcceptedAt** | datetime(6) (Null) | วันเวลาที่เจ้าหน้าที่กดรับเรื่อง |
| **PreparingAt** | datetime(6) (Null) | วันเวลาที่เริ่มจัดเตรียมสิ่งของ |
| **DeliveringAt** | datetime(6) (Null) | วันเวลาที่เจ้าหน้าที่เริ่มเดินทาง |
| **CompletedAt** | datetime(6) (Null) | วันเวลาที่ช่วยเหลือสำเร็จ |
| **CancelledAt** | datetime(6) (Null) | วันเวลาที่คำขอถูกยกเลิก |
| **UpdatedAt** | datetime(6) (Null) | วันเวลาที่อัปเดตข้อมูลล่าสุด |

### 6. ตาราง SOS Request Items (รายละเอียดรายการสิ่งของในแต่ละคำขอ SOS)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(10) (PK) | รหัสรายการสิ่งของในคำขอ |
| **SosRequestId** | varchar(10) (FK) | รหัสคำขอ SOS (เชื่อมโยงกับ `sos_requests.Id`) |
| **ReliefItemId** | varchar(10) (FK) | รหัสสิ่งของบรรเทาทุกข์ (เชื่อมโยงกับ `relief_items.Id`) |
| **Quantity** | int(11) | จำนวนสิ่งของที่ร้องขอ |
| **Unit** | varchar(50) | หน่วยนับ ณ ตอนที่ขอ (เช่น ถุง, แพ็ค) |
| **CreatedAt** | datetime(6) | วันเวลาที่เพิ่มรายการสิ่งของนี้ |

### 7. ตาราง Relief Categories (หมวดหมู่สิ่งของบรรเทาทุกข์)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(5) (PK) | รหัสหมวดหมู่สิ่งของ (เช่น food) |
| **Name** | varchar(100) | ชื่อหมวดหมู่ (เช่น อาหาร, ยารักษาโรค) |
| **Icon** | varchar(50) | ชื่อ Icon สำหรับนำไปแสดงผลบนหน้าเว็บ |
| **IsActive** | tinyint(1) (boolean) | สถานะเปิดใช้งานหมวดหมู่ |
| **CreatedAt** | datetime(6) | วันเวลาที่สร้างหมวดหมู่ |

### 8. ตาราง Relief Items (รายการสิ่งของบรรเทาทุกข์ในคลัง)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(10) (PK) | รหัสสิ่งของบรรเทาทุกข์ |
| **ReliefCategoryId**| varchar(5) (FK) | รหัสหมวดหมู่สิ่งของ (เชื่อมโยงกับ `relief_categories.Id`) |
| **Name** | varchar(150) | ชื่อสิ่งของบรรเทาทุกข์ (เช่น ข้าวสาร, น้ำดื่ม) |
| **Unit** | varchar(50) | หน่วยนับมาตรฐาน (เช่น ถุง, แพ็ค, กล่อง) |
| **IsActive** | tinyint(1) (boolean) | สถานะเปิดใช้งานรายการสิ่งของ |
| **CreatedAt** | datetime(6) | วันเวลาที่เพิ่มรายการสิ่งของ |

### 9. ตาราง Donations (ข้อมูลรายการบริจาคสิ่งของ)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(10) (PK) | รหัสรายการบริจาค |
| **UserId** | varchar(10) (FK) | รหัสผู้บริจาค (เชื่อมโยงกับ `users.Id`) |
| **DonationType** | longtext | ประเภทการบริจาค |
| **Description** | longtext | รายละเอียดการบริจาคเพิ่มเติม |
| **Quantity** | int(11) | จำนวนรวมของสิ่งของที่บริจาค |
| **CenterId** | varchar(5) (FK) | รหัสศูนย์รับมอบการบริจาค (เชื่อมโยงกับ `centers.Id`) |
| **Unit** | longtext | หน่วยนับสิ่งของบริจาค |
| **ImageUrl** | longtext (Null) | URL รูปภาพสิ่งของบริจาค/หลักฐาน |
| **QRCode** | longtext (Null) | ข้อมูล/รูปภาพ QR Code สำหรับการบริจาค |
| **Status** | longtext | สถานะการรับบริจาค |
| **CreatedAt** | datetime(6) | วันเวลาที่แจ้งบริจาค |
| **UpdatedAt** | datetime(6) (Null) | วันเวลาที่อัปเดตข้อมูลล่าสุด |

### 10. ตาราง Donation Items (รายละเอียดสิ่งของในแต่ละรายการบริจาค)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(10) (PK) | รหัสรายการสิ่งของที่บริจาค |
| **DonationId** | varchar(10) (FK) | รหัสการบริจาค (เชื่อมโยงกับ `donations.Id`) |
| **ReliefItemId** | varchar(10) (FK) | รหัสสิ่งของบรรเทาทุกข์ (เชื่อมโยงกับ `relief_items.Id`) |
| **Quantity** | int(11) | จำนวนสิ่งของที่บริจาค |
| **Unit** | longtext | หน่วยนับสิ่งของบริจาค |