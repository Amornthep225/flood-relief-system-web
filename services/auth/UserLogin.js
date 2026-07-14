import { API_URL } from "@/services/config";

async function readResponse(response) {
    const contentType =
        response.headers.get("content-type") || "";

    const responseText = await response.text();

    let data = {};

    if (
        responseText &&
        contentType.includes("application/json")
    ) {
        try {
            data = JSON.parse(responseText);
        } catch {
            data = {};
        }
    }

    if (!response.ok) {
        const message =
            data.message ||
            responseText ||
            `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ (${response.status})`;

        throw new Error(message);
    }

    if (!responseText) {
        return {};
    }

    if (!contentType.includes("application/json")) {
        throw new Error(
            "API ส่งข้อมูลกลับมาไม่ใช่ JSON"
        );
    }

    return data;
}

export async function userLogin(payload) {
    try {
        const response = await fetch(
            `${API_URL}/auth/user-login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        return await readResponse(response);
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                "ไม่สามารถเชื่อมต่อ Backend ได้ กรุณาตรวจสอบว่า API เปิดอยู่"
            );
        }

        throw error;
    }
}