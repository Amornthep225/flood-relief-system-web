import { API_URL } from "../config";

export async function userRegister(payload) {
    const res = await fetch(`${API_URL}/auth/user-register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "สมัครสมาชิกไม่สำเร็จ");
    }

    return data;
}