import { API_URL } from "../config";

export async function adminLogin(payload) {
    const res = await fetch(`${API_URL}/auth/admin-login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "เข้าสู่ระบบผู้ดูแลไม่สำเร็จ");
    }

    return data;
}