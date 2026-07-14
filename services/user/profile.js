import { API_URL } from "../config";

export async function getUserProfile() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch(`${API_URL}/users/${user.userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "โหลดข้อมูลผู้ใช้ไม่สำเร็จ");
    }

    return data;
}