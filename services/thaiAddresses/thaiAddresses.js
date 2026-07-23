import { API_URL } from "@/services/config";

function getToken() {
    if (typeof window === "undefined") {
        return null;
    }

    const token = localStorage.getItem("token");

    if (token) {
        return token;
    }

    const adminStorage =
        localStorage.getItem("admin");

    if (!adminStorage) {
        return null;
    }

    try {
        const admin =
            JSON.parse(adminStorage);

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

async function parseResponse(response) {
    const contentType =
        response.headers.get("content-type");

    const data = contentType?.includes(
        "application/json"
    )
        ? await response.json()
        : null;

    if (!response.ok) {
        throw new Error(
            data?.message ||
            "ไม่สามารถโหลดข้อมูลที่อยู่ได้"
        );
    }

    return data;
}

function getHeaders() {
    const token = getToken();

    return token
        ? {
              Authorization: `Bearer ${token}`,
          }
        : {};
}

export async function getProvinces() {
    const response = await fetch(
        `${API_URL}/thai-addresses/provinces`,
        {
            headers: getHeaders(),
            cache: "no-store",
        }
    );

    return parseResponse(response);
}

export async function getDistricts(
    provinceId
) {
    const response = await fetch(
        `${API_URL}/thai-addresses/provinces/${provinceId}/districts`,
        {
            headers: getHeaders(),
            cache: "no-store",
        }
    );

    return parseResponse(response);
}

export async function getSubDistricts(
    districtId
) {
    const response = await fetch(
        `${API_URL}/thai-addresses/districts/${districtId}/sub-districts`,
        {
            headers: getHeaders(),
            cache: "no-store",
        }
    );

    return parseResponse(response);
}