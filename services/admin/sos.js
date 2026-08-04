import { API_URL } from "@/services/config";

function getAdminToken() {
    if (typeof window === "undefined") {
        return null;
    }

    return (
        localStorage.getItem("token") ||
        JSON.parse(localStorage.getItem("admin") || "{}")?.token ||
        JSON.parse(localStorage.getItem("admin") || "{}")?.accessToken ||
        null
    );
}

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
                    "เคสนี้อาจถูกเจ้าหน้าที่คนอื่นรับไปแล้ว กรุณาอัปเดตข้อมูล"
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
    const token = getAdminToken();

    if (!token) {
        throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
    }

    const hasBody =
        options.body !== undefined &&
        options.body !== null;

    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            ...(hasBody
                ? { "Content-Type": "application/json" }
                : {}),
            ...(options.headers || {}),
        },
        cache: "no-store",
    });

    return readApiResponse(response);
}

export async function getAllSosRequests(signal) {
    return authorizedFetch(`${API_URL}/sos-requests`, {
        method: "GET",
        signal,
    });
}

export async function getSosRequestById(id, signal) {
    if (!id) {
        throw new Error("ไม่พบรหัสคำขอความช่วยเหลือ");
    }

    return authorizedFetch(
        `${API_URL}/sos-requests/${encodeURIComponent(id)}`,
        {
            method: "GET",
            signal,
        }
    );
}

/*
 * ถ้า Swagger ของ Staff ใช้ Route อื่น
 * ให้แก้ URL บรรทัดนี้เพียงจุดเดียว
 */
export async function getActiveStaffs(signal) {
    return authorizedFetch(`${API_URL}/Staffs`, {
        method: "GET",
        signal,
    });
}

export async function assignSosRequest(
    id,
    assignedStaffId,
    {
        staffRemark = "",
        priority,
    } = {}
) {
    if (!id) {
        throw new Error("ไม่พบรหัสคำขอความช่วยเหลือ");
    }

    if (!assignedStaffId) {
        throw new Error("กรุณาเลือกเจ้าหน้าที่");
    }

    const payload = {
        assignedStaffId,
        staffRemark:
            String(staffRemark || "").trim() || null,
    };

    /*
     * ไม่กำหนด Normal อัตโนมัติ
     * ป้องกัน Critical/Urgent ถูกเปลี่ยนระดับตอนมอบหมาย
     */
    if (
        priority !== undefined &&
        priority !== null &&
        String(priority).trim() !== ""
    ) {
        payload.priority = String(priority).trim();
    }

    return authorizedFetch(
        `${API_URL}/sos-requests/${encodeURIComponent(id)}/assign`,
        {
            method: "PUT",
            body: JSON.stringify(payload),
        }
    );
}
