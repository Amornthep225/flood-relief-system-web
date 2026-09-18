import { API_URL } from "@/services/config";
import { readApiResponse } from "@/services/apiHelper/apiHelper";

export async function getStaffCenter(
    centerId,
    signal
) {
    if (!centerId) {
        throw new Error(
            "ไม่พบรหัสศูนย์ของเจ้าหน้าที่"
        );
    }

    const response = await fetch(
        `${API_URL}/Centers/${encodeURIComponent(
            centerId
        )}`,
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
