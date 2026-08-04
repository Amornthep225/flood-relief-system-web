import { API_URL } from "@/services/config";

function getAdminToken() {
    if (typeof window === "undefined") {
        return null;
    }

    const directToken = localStorage.getItem("token");

    if (directToken) {
        return directToken;
    }

    const rawAdmin = localStorage.getItem("admin");

    if (!rawAdmin) {
        return null;
    }

    try {
        const admin = JSON.parse(rawAdmin);

        return (
            admin?.token ||
            admin?.accessToken ||
            admin?.jwtToken ||
            null
        );
    } catch {
        return null;
    }
}

function createHeaders(hasBody = false) {
    const token = getAdminToken();

    if (!token) {
        throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
    }

    return {
        Accept: "application/json",

        ...(hasBody
            ? {
                  "Content-Type": "application/json",
              }
            : {}),

        Authorization: `Bearer ${token}`,
    };
}

async function parseResponse(response) {
    const text = await response.text();

    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        if (response.status === 400) {
            throw new Error(
                data?.message ||
                    data?.title ||
                    "ข้อมูลที่ส่งไปไม่ถูกต้อง"
            );
        }

        if (response.status === 401) {
            throw new Error("Token หมดอายุ กรุณาเข้าสู่ระบบใหม่");
        }

        if (response.status === 403) {
            throw new Error(
                data?.message || "คุณไม่มีสิทธิ์ใช้งานส่วนนี้"
            );
        }

        if (response.status === 404) {
            throw new Error(
                data?.message || "ไม่พบข้อมูลที่ต้องการ"
            );
        }

        if (response.status === 409) {
            throw new Error(
                data?.message ||
                    "ข้อมูลนี้มีการใช้งานหรือซ้ำกับข้อมูลเดิม"
            );
        }

        throw new Error(
            data?.message ||
                data?.title ||
                (typeof data === "string" ? data : "") ||
                `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ (${response.status})`
        );
    }

    return data;
}

async function authorizedFetch(url, options = {}) {
    const { signal, headers, ...fetchOptions } = options;

    const hasBody =
        fetchOptions.body !== undefined && fetchOptions.body !== null;

    const response = await fetch(url, {
        ...fetchOptions,

        headers: {
            ...createHeaders(hasBody),

            ...(headers || {}),
        },

        cache: "no-store",

        signal,
    });

    return parseResponse(response);
}

export async function getCenters(signal) {
    return authorizedFetch(`${API_URL}/Centers`, {
        method: "GET",
        signal,
    });
}

export async function getCenterById(centerId, signal) {
    if (!centerId) {
        throw new Error("ไม่พบรหัสศูนย์");
    }

    return authorizedFetch(
        `${API_URL}/Centers/${encodeURIComponent(centerId)}`,
        {
            method: "GET",
            signal,
        }
    );
}

export async function createCenter(payload) {
    if (!payload) {
        throw new Error("ไม่พบข้อมูลศูนย์");
    }

    return authorizedFetch(`${API_URL}/Centers`, {
        method: "POST",

        body: JSON.stringify(payload),
    });
}

export async function updateCenter(centerId, payload) {
    if (!centerId) {
        throw new Error("ไม่พบรหัสศูนย์");
    }

    if (!payload) {
        throw new Error("ไม่พบข้อมูลที่ต้องการแก้ไข");
    }

    return authorizedFetch(
        `${API_URL}/Centers/${encodeURIComponent(centerId)}`,
        {
            method: "PUT",

            body: JSON.stringify(payload),
        }
    );
}

export async function deleteCenter(centerId) {
    if (!centerId) {
        throw new Error("ไม่พบรหัสศูนย์");
    }

    return authorizedFetch(
        `${API_URL}/Centers/${encodeURIComponent(centerId)}`,
        {
            method: "DELETE",
        }
    );
}

export async function getLowStockItems(signal) {
    return authorizedFetch(`${API_URL}/CenterInventories/low-stock`, {
        method: "GET",
        signal,
    });
}