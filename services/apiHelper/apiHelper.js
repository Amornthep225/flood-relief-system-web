
export function getToken() {
    if (typeof window === "undefined") {
        return null;
    }

    return localStorage.getItem("token");
}

export async function readApiResponse(response) {

    const text = await response.text();

    let data = {};


    if (text) {
        try {
            data = JSON.parse(text);
        }
        catch {
            data = {};
        }
    }


    if (!response.ok) {

        if (response.status === 401) {
            throw new Error(
                "Token หมดอายุหรือไม่มีสิทธิ์ กรุณาเข้าสู่ระบบใหม่"
            );
        }


        if (response.status === 403) {
            throw new Error(
                "คุณไม่มีสิทธิ์ใช้งานส่วนนี้"
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
