import { API_URL } from "@/services/config";

function getAdminToken() {
    if (typeof window === "undefined") {
        return null;
    }

    const directToken =
        localStorage.getItem("token");

    if (directToken) {
        return directToken;
    }

    const rawAdmin =
        localStorage.getItem("admin");

    if (!rawAdmin) {
        return null;
    }

    try {
        const admin =
            JSON.parse(rawAdmin);

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

async function readApiResponse(
    response
) {
    const text =
        await response.text();

    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        if (response.status === 400) {
            throw new Error(
                data?.message ||
                    data?.title ||
                    "ข้อมูลที่ส่งไปไม่ถูกต้อง"
            );
        }

        if (response.status === 401) {
            throw new Error(
                "Token หมดอายุ กรุณาเข้าสู่ระบบใหม่"
            );
        }

        if (response.status === 403) {
            throw new Error(
                data?.message ||
                    "คุณไม่มีสิทธิ์ใช้งานส่วนนี้"
            );
        }

        if (response.status === 404) {
            throw new Error(
                data?.message ||
                    "ไม่พบข้อมูลที่ต้องการ"
            );
        }

        throw new Error(
            data?.message ||
                data?.title ||
                (typeof data === "string"
                    ? data
                    : "") ||
                `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ (${response.status})`
        );
    }

    return data;
}

async function authorizedFetch(
    url,
    options = {}
) {
    const token = getAdminToken();

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
        fetchOptions.body !==
            undefined &&
        fetchOptions.body !== null;

    const response = await fetch(
        url,
        {
            ...fetchOptions,

            headers: {
                Accept:
                    "application/json",

                Authorization:
                    `Bearer ${token}`,

                ...(hasBody
                    ? {
                          "Content-Type":
                              "application/json",
                      }
                    : {}),

                ...(headers || {}),
            },

            cache: "no-store",

            signal,
        }
    );

    return readApiResponse(
        response
    );
}

function normalizeApiArray(
    response
) {
    if (Array.isArray(response)) {
        return response;
    }

    if (
        Array.isArray(
            response?.data
        )
    ) {
        return response.data;
    }

    if (
        Array.isArray(
            response?.items
        )
    ) {
        return response.items;
    }

    if (
        Array.isArray(
            response?.centers
        )
    ) {
        return response.centers;
    }

    if (
        Array.isArray(
            response?.inventories
        )
    ) {
        return response.inventories;
    }

    if (
        Array.isArray(
            response?.data?.items
        )
    ) {
        return response.data.items;
    }

    if (
        Array.isArray(
            response?.data?.centers
        )
    ) {
        return response.data.centers;
    }

    if (
        Array.isArray(
            response?.data
                ?.inventories
        )
    ) {
        return response.data
            .inventories;
    }

    return [];
}

export async function getAllSosRequests(
    signal
) {
    return authorizedFetch(
        `${API_URL}/sos-requests`,
        {
            method: "GET",
            signal,
        }
    );
}

export async function getAllStaffs(
    signal
) {
    return authorizedFetch(
        `${API_URL}/Staffs`,
        {
            method: "GET",
            signal,
        }
    );
}

export async function getAllCenters(
    signal
) {
    return authorizedFetch(
        `${API_URL}/Centers`,
        {
            method: "GET",
            signal,
        }
    );
}

export async function getInventoryByCenter(
    centerId,
    signal
) {
    const resolvedCenterId =
        String(
            centerId || ""
        ).trim();

    if (!resolvedCenterId) {
        throw new Error(
            "ไม่พบรหัสศูนย์"
        );
    }

    return authorizedFetch(
        `${API_URL}/CenterInventories/center/${encodeURIComponent(
            resolvedCenterId
        )}`,
        {
            method: "GET",
            signal,
        }
    );
}

export async function getAllInventories(
    signal
) {
    if (signal?.aborted) {
        throw new DOMException(
            "Request aborted",
            "AbortError"
        );
    }

    const centersResponse =
        await getAllCenters(
            signal
        );

    const centers =
        normalizeApiArray(
            centersResponse
        );

    if (
        centers.length === 0
    ) {
        return [];
    }

    const centerIds = [
        ...new Set(
            centers
                .map(
                    (center) =>
                        center?.id ??
                        center?.centerId ??
                        ""
                )
                .map((id) =>
                    String(id).trim()
                )
                .filter(Boolean)
        ),
    ];

    if (
        centerIds.length === 0
    ) {
        return [];
    }

    const results =
        await Promise.allSettled(
            centerIds.map(
                async (
                    centerId
                ) => {
                    const response =
                        await getInventoryByCenter(
                            centerId,
                            signal
                        );

                    const inventories =
                        normalizeApiArray(
                            response
                        );

                    return inventories.map(
                        (
                            inventory
                        ) => ({
                            ...inventory,

                            centerId:
                                inventory
                                    ?.centerId ??
                                centerId,
                        })
                    );
                }
            )
        );

    const abortedResult =
        results.find(
            (result) =>
                result.status ===
                    "rejected" &&
                result.reason?.name ===
                    "AbortError"
        );

    if (abortedResult) {
        throw abortedResult.reason;
    }

    const inventories =
        results
            .filter(
                (result) =>
                    result.status ===
                    "fulfilled"
            )
            .flatMap(
                (result) =>
                    result.value
            );

    const failedResults =
        results.filter(
            (result) =>
                result.status ===
                "rejected"
        );

    if (
        failedResults.length >
            0 &&
        inventories.length === 0
    ) {
        console.error(
            "โหลด Inventory ทุกศูนย์ไม่สำเร็จ:",
            failedResults.map(
                (result) =>
                    result.reason
            )
        );

        throw (
            failedResults[0]
                ?.reason ||
            new Error(
                "ไม่สามารถโหลดข้อมูลคลังสินค้าได้"
            )
        );
    }

    if (
        failedResults.length > 0
    ) {
        console.warn(
            `มี ${failedResults.length} ศูนย์ที่โหลดคลังไม่สำเร็จ`
        );
    }

    return inventories;
}

export async function getLowStockInventories(
    signal
) {
    return authorizedFetch(
        `${API_URL}/CenterInventories/low-stock`,
        {
            method: "GET",
            signal,
        }
    );
}

export async function getAllDonations(
    signal
) {
    return authorizedFetch(
        `${API_URL}/Donations`,
        {
            method: "GET",
            signal,
        }
    );
}