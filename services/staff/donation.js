import { API_URL } from "@/services/config";
import {
    getToken,
    readApiResponse,
} from "@/services/apiHelper/apiHelper";

function authHeaders() {
    const token = getToken();

    if (!token) {
        throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
    }

    return {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export function extractDonationId(value) {
    const rawValue = String(value || "").trim();

    if (!rawValue) {
        return "";
    }

    try {
        const url = new URL(rawValue);
        const idFromQuery = url.searchParams.get("id");

        if (idFromQuery) {
            return idFromQuery.trim();
        }

        const pathParts = url.pathname.split("/").filter(Boolean);
        return pathParts.at(-1)?.trim() || rawValue;
    } catch {
        const queryMatch = rawValue.match(/[?&]id=([^&]+)/i);

        if (queryMatch?.[1]) {
            return decodeURIComponent(queryMatch[1]).trim();
        }

        return rawValue;
    }
}

export async function getDonationForStaff(value) {
    const donationId = extractDonationId(value);

    if (!donationId) {
        throw new Error("กรุณาระบุรหัสบริจาค");
    }

    const response = await fetch(
        `${API_URL}/donations/${encodeURIComponent(donationId)}`,
        {
            method: "GET",
            headers: authHeaders(),
            cache: "no-store",
        }
    );

    return readApiResponse(response);
}

export async function receiveDonation(donationId) {
    const response = await fetch(
        `${API_URL}/donations/${encodeURIComponent(donationId)}/receive`,
        {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify({}),
        }
    );

    return readApiResponse(response);
}
