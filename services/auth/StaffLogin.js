import { API_URL } from "../config";

export async function staffLogin(payload) {
    const res = await fetch(`${API_URL}/auth/staff-login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "เข้าสู่ระบบเจ้าหน้าที่ไม่สำเร็จ");
    }

    return data;
}