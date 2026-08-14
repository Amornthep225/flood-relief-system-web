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
        Authorization: `Bearer ${token}`,
    };
}

export async function getMyNotifications(take = 20) {
    const response = await fetch(
        `${API_URL}/notifications/me?take=${encodeURIComponent(take)}`,
        {
            method: "GET",
            headers: authHeaders(),
            cache: "no-store",
        }
    );

    return readApiResponse(response);
}

export async function markNotificationAsRead(id) {
    if (!id) {
        throw new Error("ไม่พบรหัสการแจ้งเตือน");
    }

    const response = await fetch(
        `${API_URL}/notifications/${encodeURIComponent(id)}/read`,
        {
            method: "PUT",
            headers: authHeaders(),
        }
    );

    return readApiResponse(response);
}

export async function markAllNotificationsAsRead() {
    const response = await fetch(
        `${API_URL}/notifications/read-all`,
        {
            method: "PUT",
            headers: authHeaders(),
        }
    );

    return readApiResponse(response);
}
