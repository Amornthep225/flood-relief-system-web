import { API_URL } from "@/services/config";

function getToken() {
    if (typeof window === "undefined") return null;
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
            throw new Error("Token หมดอายุหรือไม่มีสิทธิ์ กรุณาเข้าสู่ระบบใหม่");
        }
        if (response.status === 403) {
            throw new Error(data.message || "คุณไม่มีสิทธิ์ใช้งานส่วนนี้");
        }
        if (response.status === 404) {
            throw new Error(data.message || "ไม่พบข้อมูลคำขอความช่วยเหลือ");
        }
        throw new Error(
            data.message || text || `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ (${response.status})`
        );
    }

    return data;
}

function authorizedHeaders(token, hasBody = false) {
    return {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
    };
}

async function authorizedFetch(url, options = {}) {
    const token = getToken();
    if (!token) throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");

    const response = await fetch(url, {
        ...options,
        headers: {
            ...authorizedHeaders(token, Boolean(options.body)),
            ...(options.headers || {}),
        },
        cache: "no-store",
    });

    return readApiResponse(response);
}

export async function getPendingSosRequests() {
    return authorizedFetch(`${API_URL}/sos-requests/pending`);
}

export async function getMyAssignedSosRequests() {
    return authorizedFetch(`${API_URL}/sos-requests/staff/me`);
}

export async function getStaffSosRequests(params = {}) {
    const [pendingResponse, assignedResponse] = await Promise.all([
        getPendingSosRequests(),
        getMyAssignedSosRequests(),
    ]);

    const pending = Array.isArray(pendingResponse) ? pendingResponse : [];
    const assigned = Array.isArray(assignedResponse) ? assignedResponse : [];
    const map = new Map();

    [...pending, ...assigned].forEach((item) => {
        if (item?.id) map.set(item.id, item);
    });

    let requests = Array.from(map.values());

    if (params.status) {
        const status = String(params.status).toLowerCase();
        requests = requests.filter(
            (item) => String(item.status || "").toLowerCase() === status
        );
    }

    if (params.startDate) {
        const start = new Date(`${params.startDate}T00:00:00`);
        requests = requests.filter((item) => new Date(item.createdAt) >= start);
    }

    if (params.endDate) {
        const end = new Date(`${params.endDate}T23:59:59.999`);
        requests = requests.filter((item) => new Date(item.createdAt) <= end);
    }

    return requests;
}

export async function getStaffSosRequestById(id) {
    if (!id) throw new Error("ไม่พบรหัสคำขอความช่วยเหลือ");
    return authorizedFetch(
        `${API_URL}/sos-requests/${encodeURIComponent(id)}`
    );
}

export async function acceptSosRequest(
    id,
    { priority = "Normal", staffRemark = "" } = {}
) {
    if (!id) throw new Error("ไม่พบรหัสคำขอความช่วยเหลือ");

    return authorizedFetch(
        `${API_URL}/sos-requests/${encodeURIComponent(id)}/assign`,
        {
            method: "PUT",
            body: JSON.stringify({ priority, staffRemark }),
        }
    );
}

export async function updateSosRequestStatus(
    id,
    status,
    staffRemark = ""
) {
    if (!id) throw new Error("ไม่พบรหัสคำขอความช่วยเหลือ");
    if (!status) throw new Error("กรุณาระบุสถานะ");

    return authorizedFetch(
        `${API_URL}/sos-requests/${encodeURIComponent(id)}/status`,
        {
            method: "PUT",
            body: JSON.stringify({ status, staffRemark }),
        }
    );
}
