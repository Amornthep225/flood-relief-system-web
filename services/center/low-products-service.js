import { API_URL } from "@/services/config";

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
            cache: "no-store",
        }
    );

    return parseResponse(response);
}