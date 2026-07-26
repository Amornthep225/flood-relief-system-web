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
            throw new Error(
                "Token หมดอายุหรือไม่มีสิทธิ์ กรุณาเข้าสู่ระบบใหม่"
            );
        }

        if (response.status === 403) {
            throw new Error("คุณไม่มีสิทธิ์ใช้งานส่วนนี้");
        }

        if (response.status === 404) {
            throw new Error(
                data.message || "ไม่พบข้อมูลคำขอความช่วยเหลือ"
            );
        }

        throw new Error(
            data.message ||
                text ||
                `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ (${response.status})`
        );
    }

    return data;
}

function createAuthorizedHeaders(token, hasBody = false) {
    return {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(hasBody
            ? {
                  "Content-Type": "application/json",
              }
            : {}),
    };
}

export async function getStaffSosRequests(params = {}) {
    const token = getToken();

    if (!token) {
        throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
    }

    const query = new URLSearchParams();

    if (params.startDate) {
        query.set("startDate", params.startDate);
    }

    if (params.endDate) {
        query.set("endDate", params.endDate);
    }

    if (params.status) {
        query.set("status", params.status);
    }

    const queryString = query.toString();

    const url = `${API_URL}/sos-requests${
        queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
        method: "GET",
        headers: createAuthorizedHeaders(token),
        cache: "no-store",
    });

    return readApiResponse(response);
}

export async function getStaffSosRequestById(id) {
    const token = getToken();

    if (!token) {
        throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
    }

    if (!id) {
        throw new Error("ไม่พบรหัสคำขอความช่วยเหลือ");
    }

    const response = await fetch(
        `${API_URL}/sos-requests/${encodeURIComponent(id)}`,
        {
            method: "GET",
            headers: createAuthorizedHeaders(token),
            cache: "no-store",
        }
    );

    return readApiResponse(response);
}

export async function acceptSosRequest(id) {
    const token = getToken();

    if (!token) {
        throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
    }

    const response = await fetch(
        `${API_URL}/sos-requests/${encodeURIComponent(id)}/accept`,
        {
            method: "PUT",
            headers: createAuthorizedHeaders(token),
        }
    );

    return readApiResponse(response);
}

export async function updateSosRequestStatus(
    id,
    status,
    staffRemark = ""
) {
    const token = getToken();

    if (!token) {
        throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
    }

    const response = await fetch(
        `${API_URL}/sos-requests/${encodeURIComponent(id)}/status`,
        {
            method: "PUT",
            headers: createAuthorizedHeaders(token, true),
            body: JSON.stringify({
                status,
                staffRemark,
            }),
        }
    );

    return readApiResponse(response);
}