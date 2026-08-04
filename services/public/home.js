import { API_URL } from "@/services/config";

async function readApiResponse(response) {
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
        throw new Error(
            data?.message ||
                data?.title ||
                (typeof data === "string"
                    ? data
                    : "") ||
                `โหลดข้อมูลไม่สำเร็จ (${response.status})`
        );
    }

    return data;
}

export async function getHomeStatistics(
    signal
) {
    const response = await fetch(
        `${API_URL}/public-statistics/home`,
        {
            method: "GET",

            headers: {
                Accept: "application/json",
            },

            cache: "no-store",
            signal,
        }
    );

    return readApiResponse(response);
}