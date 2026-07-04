import { API_URL } from "../config";

export async function staffRegister(payload) {
    const res = await fetch(`${API_URL}/auth/staff-register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "สร้างบัญชีเจ้าหน้าที่ไม่สำเร็จ");
    }

    return data;
}