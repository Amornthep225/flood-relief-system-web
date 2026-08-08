import { API_URL } from "@/services/config";

function getToken() {
    if (typeof window === "undefined") {
        return null;
    }

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
        if (response.status === 400) {
            throw new Error(
                data.message ||
                    "ข้อมูลที่ส่งไปไม่ถูกต้อง"
            );
        }

        if (response.status === 401) {
            throw new Error(
                "Token หมดอายุหรือไม่มีสิทธิ์ กรุณาเข้าสู่ระบบใหม่"
            );
        }

        if (response.status === 403) {
            throw new Error(
                data.message ||
                    "คุณไม่มีสิทธิ์ใช้งานส่วนนี้"
            );
        }

        if (response.status === 404) {
            throw new Error(
                data.message ||
                    "ไม่พบข้อมูลคำขอความช่วยเหลือ"
            );
        }

        if (response.status === 409) {
            throw new Error(
                data.message ||
                    "ข้อมูลมีการเปลี่ยนแปลง กรุณาอัปเดตข้อมูลใหม่"
            );
        }

        throw new Error(
            data.message ||
                text ||
                `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ (${response.status})`
        );
    }

    return data;
}

function authorizedHeaders(
    token,
    hasBody = false
) {
    return {
        Accept: "application/json",

        Authorization: `Bearer ${token}`,

        ...(hasBody
            ? {
                  "Content-Type":
                      "application/json",
              }
            : {}),
    };
}

async function authorizedFetch(
    url,
    options = {}
) {
    const token = getToken();

    if (!token) {
        throw new Error(
            "ไม่พบ Token กรุณาเข้าสู่ระบบใหม่"
        );
    }

    const {
        signal,
        headers,
        ...fetchOptions
    } = options;

    const hasBody =
        fetchOptions.body !== undefined &&
        fetchOptions.body !== null;

    const response = await fetch(url, {
        ...fetchOptions,

        headers: {
            ...authorizedHeaders(
                token,
                hasBody
            ),

            ...(headers || {}),
        },

        cache: "no-store",

        signal,
    });

    return readApiResponse(response);
}

/*
|--------------------------------------------------------------------------
| ดึงเคส SOS ที่ยังรอเจ้าหน้าที่รับงาน
|--------------------------------------------------------------------------
*/

export async function getPendingSosRequests(
    signal
) {
    return authorizedFetch(
        `${API_URL}/sos-requests/pending`,
        {
            method: "GET",
            signal,
        }
    );
}

/*
|--------------------------------------------------------------------------
| ดึงเคสที่ถูกมอบหมายให้ Staff คนปัจจุบัน
|--------------------------------------------------------------------------
*/

export async function getMyAssignedSosRequests(
    signal
) {
    return authorizedFetch(
        `${API_URL}/sos-requests/staff/me`,
        {
            method: "GET",
            signal,
        }
    );
}

/*
|--------------------------------------------------------------------------
| รวมเคสรอรับ + เคสของ Staff
|--------------------------------------------------------------------------
|
| ใช้ได้กับหน้า Staff SOS เดิม
| และหน้า Crisis Map
|
*/

export async function getStaffSosRequests(
    params = {},
    signal
) {
    const [
        pendingResponse,
        assignedResponse,
    ] = await Promise.all([
        getPendingSosRequests(signal),

        getMyAssignedSosRequests(signal),
    ]);

    const pending = Array.isArray(
        pendingResponse
    )
        ? pendingResponse
        : Array.isArray(pendingResponse?.data)
          ? pendingResponse.data
          : Array.isArray(
                pendingResponse?.requests
            )
            ? pendingResponse.requests
            : [];

    const assigned = Array.isArray(
        assignedResponse
    )
        ? assignedResponse
        : Array.isArray(
              assignedResponse?.data
          )
          ? assignedResponse.data
          : Array.isArray(
                assignedResponse?.requests
            )
            ? assignedResponse.requests
            : [];

    const requestMap = new Map();

    /*
     * ใส่ Pending ก่อน
     */
    pending.forEach((item) => {
        if (!item?.id) {
            return;
        }

        requestMap.set(item.id, item);
    });

    /*
     * ใส่ Assigned ทีหลัง
     *
     * ถ้ามี SOS ID ซ้ำ
     * ให้ข้อมูล Assigned ทับ Pending
     * เพราะสถานะใหม่กว่า
     */
    assigned.forEach((item) => {
        if (!item?.id) {
            return;
        }

        requestMap.set(item.id, item);
    });

    let requests = Array.from(
        requestMap.values()
    );

    /*
     * Filter สถานะ
     */
    if (params.status) {
        const selectedStatus = String(
            params.status
        )
            .trim()
            .toLowerCase();

        requests = requests.filter(
            (item) =>
                String(item.status || "")
                    .trim()
                    .toLowerCase() ===
                selectedStatus
        );
    }

    /*
     * Filter ระดับความเร่งด่วน
     */
    if (params.priority) {
        const selectedPriority = String(
            params.priority
        )
            .trim()
            .toLowerCase();

        requests = requests.filter(
            (item) =>
                String(item.priority || "")
                    .trim()
                    .toLowerCase() ===
                selectedPriority
        );
    }

    /*
     * Filter วันที่เริ่มต้น
     */
    if (params.startDate) {
        const startDate = new Date(
            `${params.startDate}T00:00:00`
        );

        requests = requests.filter(
            (item) => {
                const createdAt = new Date(
                    item.createdAt
                );

                return (
                    !Number.isNaN(
                        createdAt.getTime()
                    ) &&
                    createdAt >= startDate
                );
            }
        );
    }

    /*
     * Filter วันที่สิ้นสุด
     */
    if (params.endDate) {
        const endDate = new Date(
            `${params.endDate}T23:59:59.999`
        );

        requests = requests.filter(
            (item) => {
                const createdAt = new Date(
                    item.createdAt
                );

                return (
                    !Number.isNaN(
                        createdAt.getTime()
                    ) &&
                    createdAt <= endDate
                );
            }
        );
    }

    /*
     * เรียง:
     *
     * Critical ก่อน
     * Urgent รองลงมา
     * Normal ลำดับสุดท้าย
     *
     * ถ้าระดับเท่ากัน
     * ให้รายการใหม่อยู่ก่อน
     */
    requests.sort((first, second) => {
        const priorityOrder = {
            critical: 1,
            urgent: 2,
            normal: 3,
        };

        const firstPriority =
            priorityOrder[
                String(
                    first.priority || ""
                )
                    .trim()
                    .toLowerCase()
            ] ?? 4;

        const secondPriority =
            priorityOrder[
                String(
                    second.priority || ""
                )
                    .trim()
                    .toLowerCase()
            ] ?? 4;

        if (
            firstPriority !==
            secondPriority
        ) {
            return (
                firstPriority -
                secondPriority
            );
        }

        return (
            new Date(
                second.createdAt || 0
            ).getTime() -
            new Date(
                first.createdAt || 0
            ).getTime()
        );
    });

    return requests;
}

/*
|--------------------------------------------------------------------------
| ดูรายละเอียด SOS ตาม ID
|--------------------------------------------------------------------------
*/

export async function getStaffSosRequestById(
    id,
    signal
) {
    if (!id) {
        throw new Error(
            "ไม่พบรหัสคำขอความช่วยเหลือ"
        );
    }

    return authorizedFetch(
        `${API_URL}/sos-requests/${encodeURIComponent(
            id
        )}`,
        {
            method: "GET",
            signal,
        }
    );
}

/*
|--------------------------------------------------------------------------
| Staff รับเคส
|--------------------------------------------------------------------------
|
| สำคัญ:
| ห้ามส่ง priority = Normal แบบอัตโนมัติ
|
| เพราะจะทำให้เคส Critical/Urgent
| ถูกเปลี่ยนเป็น Normal ตอนรับงาน
|
| ถ้าไม่ได้ต้องการแก้ Priority
| ให้ส่งเฉพาะ staffRemark
|
*/

export async function acceptSosRequest(
    id,
    {
        priority,
        staffRemark = "",
    } = {}
) {
    if (!id) {
        throw new Error(
            "ไม่พบรหัสคำขอความช่วยเหลือ"
        );
    }

    const payload = {
        staffRemark:
            staffRemark.trim() || null,
    };

    /*
     * ใส่ Priority เฉพาะกรณี
     * ผู้เรียกส่งค่ามาจริง ๆ เท่านั้น
     */
    if (
        priority !== undefined &&
        priority !== null &&
        String(priority).trim() !== ""
    ) {
        payload.priority =
            String(priority).trim();
    }

    return authorizedFetch(
        `${API_URL}/sos-requests/${encodeURIComponent(
            id
        )}/assign`,
        {
            method: "PUT",

            body: JSON.stringify(
                payload
            ),
        }
    );
}

/*
|--------------------------------------------------------------------------
| อัปเดตสถานะ SOS
|--------------------------------------------------------------------------
*/

export async function updateSosRequestStatus(
    id,
    status,
    staffRemark = ""
) {
    if (!id) {
        throw new Error(
            "ไม่พบรหัสคำขอความช่วยเหลือ"
        );
    }

    if (!status) {
        throw new Error(
            "กรุณาระบุสถานะ"
        );
    }

    return authorizedFetch(
        `${API_URL}/sos-requests/${encodeURIComponent(
            id
        )}/status`,
        {
            method: "PUT",

            body: JSON.stringify({
                status:
                    String(status).trim(),

                staffRemark:
                    staffRemark.trim() ||
                    null,
            }),
        }
    );
}
export async function checkSosStock(id) {
    if (!id) {
        throw new Error(
            "ไม่พบรหัสคำขอความช่วยเหลือ"
        );
    }

    return authorizedFetch(
        `${API_URL}/sos-requests/${encodeURIComponent(
            id
        )}/stock-check`,
        {
            method: "GET",
        }
    );
}