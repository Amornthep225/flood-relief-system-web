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

export async function getCenterInventory(centerId, signal) {
    if (!centerId) {
        throw new Error("ไม่พบรหัสศูนย์ของเจ้าหน้าที่");
    }

    const response = await fetch(
        `${API_URL}/CenterInventories/center/${encodeURIComponent(centerId)}`,
        {
            method: "GET",
            headers: authHeaders(),
            cache: "no-store",
            signal,
        }
    );

    return readApiResponse(response);
}

export async function getInventoryTransactions(
    inventoryId,
    signal
) {
    if (!inventoryId) {
        throw new Error("ไม่พบรหัสสินค้าในคลัง");
    }

    const response = await fetch(
        `${API_URL}/CenterInventories/${encodeURIComponent(inventoryId)}/transactions`,
        {
            method: "GET",
            headers: authHeaders(),
            cache: "no-store",
            signal,
        }
    );

    return readApiResponse(response);
}
