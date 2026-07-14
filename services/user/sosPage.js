import { API_URL } from "../config";

async function parseResponse(response) {
    const text = await response.text();

    let data = {};

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            throw new Error("รูปแบบข้อมูลจาก API ไม่ถูกต้อง");
        }
    }

    if (!response.ok) {
        throw new Error(data.message || "ไม่สามารถดำเนินการได้");
    }

    return data;
}

function getToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
    }

    return token;
}

export async function getActiveReliefCategories() {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/relief-categories/active`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );

    return parseResponse(response);
}

export async function getActiveReliefItems() {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/relief-items/active`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );

    return parseResponse(response);
}

export async function createSosRequest(payload) {
    const token = getToken();

    const response = await fetch(`${API_URL}/sos-requests`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    return parseResponse(response);
}