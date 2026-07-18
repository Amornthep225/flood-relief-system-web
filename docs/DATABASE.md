## 🗄️ โครงสร้างฐานข้อมูล (Database Structure)

### 1. ตาราง Users (ข้อมูลผู้ใช้งานทั่วไป / ผู้ประสบภัย / ผู้บริจาค)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(10) (PK) | รหัสผู้ใช้งาน[cite: 1] |
| **FullName** | longtext | ชื่อ-นามสกุล[cite: 1] |
| **PhoneNumber** | varchar(10) | เบอร์โทรศัพท์ติดต่อ[cite: 1] |
| **Email** | longtext | อีเมล (ใช้สำหรับ Login)[cite: 1] |
| **PasswordHash** | longtext | รหัสผ่านที่เข้ารหัสแล้ว[cite: 1] |
| **Role** | longtext | บทบาท (User, Donor)[cite: 1] |
| **IsActive** | tinyint(1) (boolean) | สถานะการใช้งานบัญชี (0 = Inactive, 1 = Active)[cite: 1] |
| **CreatedAt** | datetime(6) | วันเวลาที่ลงทะเบียน[cite: 1] |
| **UpdatedAt** | datetime(6) (Null) | วันเวลาที่อัปเดตข้อมูลล่าสุด (มีค่าเป็น NULL ได้)[cite: 1] |

### 2. ตาราง Admins (ข้อมูลผู้ดูแลระบบ)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(2) (PK) | รหัสผู้ดูแลระบบ[cite: 1] |
| **Username** | longtext | ชื่อผู้ใช้งานสำหรับ Admin[cite: 1] |
| **Email** | longtext | อีเมล[cite: 1] |
| **PasswordHash** | longtext | รหัสผ่านที่เข้ารหัสแล้ว[cite: 1] |
| **Role** | longtext | บทบาท (Admin)[cite: 1] |
| **IsActive** | tinyint(1) (boolean) | สถานะการใช้งานบัญชี[cite: 1] |
| **CreatedAt** | datetime(6) | วันเวลาที่สร้างบัญชี[cite: 1] |
| **UpdatedAt** | datetime(6) (Null) | วันเวลาที่อัปเดตข้อมูลล่าสุด[cite: 1] |

### 3. ตาราง Staffs (ข้อมูลเจ้าหน้าที่ช่วยเหลือภาคสนาม)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(5) (PK) | รหัสเจ้าหน้าที่[cite: 1] |
| **CenterId** | varchar(5) (FK) | รหัสศูนย์บรรเทาทุกข์ที่สังกัด (เชื่อมโยงกับ `centers.Id`)[cite: 1] |
| **FullName** | longtext | ชื่อ-นามสกุลเจ้าหน้าที่[cite: 1] |
| **Username** | longtext | ชื่อผู้ใช้งาน[cite: 1] |
| **Email** | longtext | อีเมล[cite: 1] |
| **PhoneNumber** | varchar(10) | เบอร์โทรศัพท์ติดต่อ[cite: 1] |
| **PasswordHash** | longtext | รหัสผ่านที่เข้ารหัสแล้ว[cite: 1] |
| **Role** | longtext | บทบาท (Staff)[cite: 1] |
| **IsActive** | tinyint(1) (boolean) | สถานะการใช้งานบัญชี[cite: 1] |
| **CreatedAt** | datetime(6) | วันเวลาที่สร้างบัญชี[cite: 1] |
| **UpdatedAt** | datetime(6) (Null) | วันเวลาที่อัปเดตข้อมูลล่าสุด[cite: 1] |

### 4. ตาราง Centers (ศูนย์บริหารจัดการ/จุดรับความช่วยเหลือ)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(5) (PK) | รหัสศูนย์บรรเทาทุกข์[cite: 1] |
| **CenterName** | varchar(150) | ชื่อศูนย์บรรเทาทุกข์[cite: 1] |
| **Address** | longtext | ที่อยู่ของศูนย์[cite: 1] |
| **Province** | longtext | จังหวัด[cite: 1] |
| **District** | longtext | อำเภอ / เขต[cite: 1] |
| **SubDistrict** | longtext | ตำบล / แขวง[cite: 1] |
| **ZipCode** | varchar(5) | รหัสไปรษณีย์[cite: 1] |
| **PhoneNumber** | varchar(10) | เบอร์โทรศัพท์ติดต่อของศูนย์[cite: 1] |
| **ContactName** | longtext | ชื่อผู้ประสานงานหลัก[cite: 1] |
| **Latitude** | double | พิกัดละติจูดของศูนย์[cite: 1] |
| **Longitude** | double | พิกัดลองจิจูดของศูนย์[cite: 1] |
| **IsActive** | tinyint(1) (boolean) | สถานะการเปิดใช้งานของศูนย์[cite: 1] |
| **CreatedAt** | datetime(6) | วันเวลาที่เพิ่มข้อมูล[cite: 1] |
| **UpdatedAt** | datetime(6) (Null) | วันเวลาที่แก้ไขข้อมูลล่าสุด[cite: 1] |

### 5. ตาราง SOS Requests (คำขอความช่วยเหลือจากผู้ประสบภัย)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(10) (PK) | รหัสคำขอ SOS[cite: 1] |
| **UserId** | varchar(10) (FK) | รหัสผู้แจ้งขอความช่วยเหลือ (เชื่อมโยงกับ `users.Id`)[cite: 1] |
| **CenterId** | varchar(5) (FK Null) | รหัสศูนย์ที่รับผิดชอบ (เชื่อมโยงกับ `centers.Id`)[cite: 1] |
| **AssignedStaffId**| varchar(5) (FK Null) | รหัสเจ้าหน้าที่ผู้รับผิดชอบงาน (เชื่อมโยงกับ `staffs.Id`)[cite: 1] |
| **Latitude** | double | พิกัดละติจูดของผู้แจ้ง[cite: 1] |
| **Longitude** | double | พิกัดลองจิจูดของผู้แจ้ง[cite: 1] |
| **AddressDetail** | varchar(500) | รายละเอียดสถานที่/จุดสังเกตเพิ่มเติม[cite: 1] |
| **Priority** | varchar(20) | ระดับความเร่งด่วน (เช่น Normal, High)[cite: 1] |
| **Status** | varchar(30) | สถานะคำขอ (Pending, Accepted, Preparing, Delivering, Completed, Cancelled)[cite: 1] |
| **UserRemark** | varchar(500) (Null) | หมายเหตุเพิ่มเติมจากผู้ประสบภัย[cite: 1] |
| **StaffRemark** | varchar(500) (Null) | หมายเหตุหรือบันทึกเพิ่มเติมจากเจ้าหน้าที่[cite: 1] |
| **CreatedAt** | datetime(6) | วันเวลาที่สร้างคำขอ[cite: 1] |
| **AcceptedAt** | datetime(6) (Null) | วันเวลาที่เจ้าหน้าที่กดรับเรื่อง[cite: 1] |
| **PreparingAt** | datetime(6) (Null) | วันเวลาที่เริ่มจัดเตรียมสิ่งของ[cite: 1] |
| **DeliveringAt** | datetime(6) (Null) | วันเวลาที่เจ้าหน้าที่เริ่มเดินทาง[cite: 1] |
| **CompletedAt** | datetime(6) (Null) | วันเวลาที่ช่วยเหลือสำเร็จ[cite: 1] |
| **CancelledAt** | datetime(6) (Null) | วันเวลาที่คำขอถูกยกเลิก[cite: 1] |
| **UpdatedAt** | datetime(6) (Null) | วันเวลาที่อัปเดตข้อมูลล่าสุด[cite: 1] |

### 6. ตาราง SOS Request Items (รายละเอียดรายการสิ่งของในแต่ละคำขอ SOS)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(10) (PK) | รหัสรายการสิ่งของในคำขอ[cite: 1] |
| **SosRequestId** | varchar(10) (FK) | รหัสคำขอ SOS (เชื่อมโยงกับ `sos_requests.Id`)[cite: 1] |
| **ReliefItemId** | varchar(10) (FK) | รหัสสิ่งของบรรเทาทุกข์ (เชื่อมโยงกับ `relief_items.Id`)[cite: 1] |
| **Quantity** | int(11) | จำนวนสิ่งของที่ร้องขอ[cite: 1] |
| **Unit** | varchar(50) | หน่วยนับ ณ ตอนที่ขอ (เช่น ถุง, แพ็ค)[cite: 1] |
| **CreatedAt** | datetime(6) | วันเวลาที่เพิ่มรายการสิ่งของนี้[cite: 1] |

### 7. ตาราง Relief Categories (หมวดหมู่สิ่งของบรรเทาทุกข์)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(5) (PK) | รหัสหมวดหมู่สิ่งของ (เช่น food)[cite: 1] |
| **Name** | varchar(100) | ชื่อหมวดหมู่ (เช่น อาหาร, ยารักษาโรค)[cite: 1] |
| **Icon** | varchar(50) | ชื่อ Icon สำหรับนำไปแสดงผลบนหน้าเว็บ[cite: 1] |
| **IsActive** | tinyint(1) (boolean) | สถานะเปิดใช้งานหมวดหมู่[cite: 1] |
| **CreatedAt** | datetime(6) | วันเวลาที่สร้างหมวดหมู่[cite: 1] |

### 8. ตาราง Relief Items (รายการสิ่งของบรรเทาทุกข์ในคลัง)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **Id** | varchar(10) (PK) | รหัสสิ่งของบรรเทาทุกข์[cite: 1] |
| **ReliefCategoryId**| varchar(5) (FK) | รหัสหมวดหมู่สิ่งของ (เชื่อมโยงกับ `relief_categories.Id`)[cite: 1] |
| **Name** | varchar(150) | ชื่อสิ่งของบรรเทาทุกข์ (เช่น ข้าวสาร, น้ำดื่ม)[cite: 1] |
| **Unit** | varchar(50) | หน่วยนับมาตรฐาน (เช่น ถุง, แพ็ค, กล่อง)[cite: 1] |
| **IsActive** | tinyint(1) (boolean) | สถานะเปิดใช้งานรายการสิ่งของ[cite: 1] |
| **CreatedAt** | datetime(6) | วันเวลาที่เพิ่มรายการสิ่งของ[cite: 1] |