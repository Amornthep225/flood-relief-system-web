import { API_URL } from "../config";

export async function getStaffs() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/staffs`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "โหลดข้อมูลเจ้าหน้าที่ไม่สำเร็จ");

    return data;
}

export async function createStaff(payload) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/staffs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "เพิ่มเจ้าหน้าที่ไม่สำเร็จ");

    return data;
}

export async function updateStaff(id, payload) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/staffs/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "แก้ไขเจ้าหน้าที่ไม่สำเร็จ");

    return data;
}

export async function updateStaffStatus(id, isActive) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/staffs/${id}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "อัปเดตสถานะไม่สำเร็จ");

    return data;
}