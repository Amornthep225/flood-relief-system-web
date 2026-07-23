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

export async function getCenterById(centerId) {
    const response = await fetch(
        `${API_URL}/centers/${encodeURIComponent(
            centerId
        )}`,
        {
            method: "GET",
            headers: createHeaders(),
            cache: "no-store",
        }
    );

    return parseResponse(response);
}

export async function getInventoryByCenter(
    centerId
) {
    const response = await fetch(
        `${API_URL}/inventories/center/${encodeURIComponent(
            centerId
        )}`,
        {
            method: "GET",
            headers: createHeaders(),
            cache: "no-store",
        }
    );

    return parseResponse(response);
}

export async function getInventoryTransactions(
    centerId
) {
    const url = new URL(
        `${API_URL}/inventories/transactions`
    );

    if (centerId) {
        url.searchParams.set(
            "centerId",
            centerId
        );
    }

    const response = await fetch(
        url.toString(),
        {
            method: "GET",
            headers: createHeaders(),
            cache: "no-store",
        }
    );

    return parseResponse(response);
}

export async function stockIn(payload) {
    const response = await fetch(
        `${API_URL}/inventories/stock-in`,
        {
            method: "POST",
            headers: createHeaders(true),
            body: JSON.stringify(payload),
        }
    );

    return parseResponse(response);
}

export async function stockOut(payload) {
    const response = await fetch(
        `${API_URL}/inventories/stock-out`,
        {
            method: "POST",
            headers: createHeaders(true),
            body: JSON.stringify(payload),
        }
    );

    return parseResponse(response);
}
