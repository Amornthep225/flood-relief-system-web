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

        if (!token) {
            throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
        }

        return {
            Accept: "application/json",
            ...(hasBody
                ? { "Content-Type": "application/json" }
                : {}),
            Authorization: `Bearer ${token}`,
        };
    }

    async function parseResponse(response) {
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
        const hasBody = options.body !== undefined && options.body !== null;

        const response = await fetch(url, {
            ...options,
            headers: {
                ...createHeaders(hasBody),
                ...(options.headers || {}),
            },
            cache: "no-store",
        });

        return parseResponse(response);
    }

    export async function getCenterById(centerId) {
        if (!centerId) {
            throw new Error("ไม่พบรหัสศูนย์");
        }

        return authorizedFetch(
            `${API_URL}/centers/${encodeURIComponent(centerId)}`,
            { method: "GET" }
        );
    }

    export async function getAllInventories() {
        return authorizedFetch(`${API_URL}/CenterInventories`, {
            method: "GET",
        });
    }

    export async function getInventoryByCenter(centerId) {
        if (!centerId) {
            throw new Error("ไม่พบรหัสศูนย์");
        }

        return authorizedFetch(
            `${API_URL}/CenterInventories/center/${encodeURIComponent(centerId)}`,
            { method: "GET" }
        );
    }

    export async function getInventoryTransactions(inventoryId) {
        if (!inventoryId) {
            throw new Error("ไม่พบรหัสรายการคลัง");
        }

        return authorizedFetch(
            `${API_URL}/CenterInventories/${encodeURIComponent(inventoryId)}/transactions`,
            { method: "GET" }
        );
    }

    export async function getTransactionsByInventories(inventories = []) {
        const validItems = inventories.filter((item) => item?.id);

        if (validItems.length === 0) {
            return [];
        }

        const results = await Promise.allSettled(
            validItems.map(async (inventory) => {
                const response = await getInventoryTransactions(inventory.id);
                const list = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.items)
                    ? response.items
                    : Array.isArray(response?.data)
                        ? response.data
                        : Array.isArray(response?.transactions)
                        ? response.transactions
                        : [];

                return list.map((transaction) => ({
                    ...transaction,
                    centerInventoryId:
                        transaction.centerInventoryId ?? inventory.id,
                    reliefItemId:
                        transaction.reliefItemId ?? inventory.reliefItemId,
                    reliefItemName:
                        transaction.reliefItemName ?? inventory.reliefItemName,
                    unit: transaction.unit ?? inventory.unit,
                }));
            })
        );

        return results
            .filter((result) => result.status === "fulfilled")
            .flatMap((result) => result.value);
    }

    export async function updateMinimumQuantity(inventoryId, minimumQuantity) {
        if (!inventoryId) {
            throw new Error("ไม่พบรหัสรายการคลัง");
        }

        const value = Number(minimumQuantity);

        if (!Number.isInteger(value) || value < 0) {
            throw new Error("จำนวนขั้นต่ำต้องเป็นเลขจำนวนเต็มตั้งแต่ 0 ขึ้นไป");
        }

        return authorizedFetch(
            `${API_URL}/CenterInventories/${encodeURIComponent(inventoryId)}/minimum`,
            {
                method: "PUT",
                body: JSON.stringify({ minimumQuantity: value }),
            }
        );
    }

    export async function getLowStockInventories() {
        return authorizedFetch(`${API_URL}/CenterInventories/low-stock`, {
            method: "GET",
        });
    }


    function normalizeApiArray(response) {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.items)) return response.items;
        if (Array.isArray(response?.inventories)) return response.inventories;
        if (Array.isArray(response?.transactions)) return response.transactions;
        return [];
    }

