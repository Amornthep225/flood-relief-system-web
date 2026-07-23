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

    return {
        ...(hasBody
            ? {
                  "Content-Type": "application/json",
              }
            : {}),
        ...(token
            ? {
                  Authorization: `Bearer ${token}`,
              }
            : {}),
    };
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
                data?.title ||
                "ไม่สามารถเชื่อมต่อระบบได้"
        );
    }

    return data;
}

export async function getCenters() {
    const response = await fetch(
        `${API_URL}/centers`,
        {
            method: "GET",
            headers: createHeaders(),
            cache: "no-store",
        }
    );

    return parseResponse(response);
}

export async function getLowStockItems() {
    const response = await fetch(
        `${API_URL}/inventories/low-stock`,
        {
            method: "GET",
            headers: createHeaders(),
            cache: "no-store",
        }
    );

    return parseResponse(response);
}

export async function createCenter(payload) {
    const response = await fetch(
        `${API_URL}/centers`,
        {
            method: "POST",
            headers: createHeaders(true),
            body: JSON.stringify(payload),
        }
    );

    return parseResponse(response);
}

export async function updateCenter(
    centerId,
    payload
) {
    const response = await fetch(
        `${API_URL}/centers/${encodeURIComponent(
            centerId
        )}`,
        {
            method: "PUT",
            headers: createHeaders(true),
            body: JSON.stringify(payload),
        }
    );

    return parseResponse(response);
}

export async function deleteCenter(centerId) {
    const response = await fetch(
        `${API_URL}/centers/${encodeURIComponent(
            centerId
        )}`,
        {
            method: "DELETE",
            headers: createHeaders(),
        }
    );

    return parseResponse(response);
}
