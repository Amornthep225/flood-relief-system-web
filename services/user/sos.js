import { API_URL } from "@/services/config";

function getToken() {
    if (typeof window === "undefined") {
        return null;
    }

    return localStorage.getItem("token");
}

async function readApiResponse(response) {
    const text = await response.text();

    let data = {};

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = {};
        }
    }

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Token หมดอายุหรือไม่มีสิทธิ์ กรุณาเข้าสู่ระบบใหม่");
        }

        if (response.status === 403) {
            throw new Error("คุณไม่มีสิทธิ์ใช้งานส่วนนี้");
        }

        throw new Error(
            data.message ||
                text ||
                `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ (${response.status})`
        );
    }

    return data;
}

export async function getActiveReliefCategories() {
    const response = await fetch(
        `${API_URL}/relief-categories/active`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
        }
    );

    return readApiResponse(response);
}

export async function getActiveReliefItems() {
    const response = await fetch(
        `${API_URL}/relief-items/active`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
        }
    );

    return readApiResponse(response);
}

export async function createSosRequest(payload) {
    const token = getToken();

    if (!token) {
        throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
    }

    const response = await fetch(
        `${API_URL}/sos-requests`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        }
    );

    return readApiResponse(response);
}

export async function getMySosRequests() {
    const token = getToken();

    if (!token) {
        throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
    }

    const response = await fetch(
        `${API_URL}/sos-requests/my`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );

    return readApiResponse(response);
}

export async function getSosRequestById(id) {
    const token = getToken();

    if (!token) {
        throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
    }

    const response = await fetch(
        `${API_URL}/sos-requests/${id}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );

    return readApiResponse(response);
}

export async function cancelSosRequest(id) {
    const token = getToken();

    if (!token) {
        throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
    }

    const response = await fetch(
        `${API_URL}/sos-requests/${id}/cancel`,
        {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return readApiResponse(response);
}