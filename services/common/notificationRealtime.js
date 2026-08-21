import * as signalR from "@microsoft/signalr";
import { API_URL } from "@/services/config";
import { getToken } from "@/services/apiHelper/apiHelper";

function getNotificationHubUrl() {
    const normalizedApiUrl = API_URL.replace(/\/+$/, "");
    const backendUrl = normalizedApiUrl.endsWith("/api")
        ? normalizedApiUrl.slice(0, -4)
        : normalizedApiUrl;

    return `${backendUrl}/hubs/notifications`;
}

/**
 * เชื่อม SignalR สำหรับ Notification
 * - JWT ถูกส่งด้วย accessTokenFactory
 * - reconnect อัตโนมัติเมื่อเน็ตสะดุด
 * - ถ้าหลุดจน automatic reconnect ยอมแพ้ จะลอง start ใหม่ทุก 5 วินาที
 */
export function connectNotificationRealtime(onNotificationChanged) {
    let stopped = false;
    let retryTimer = null;

    const connection = new signalR.HubConnectionBuilder()
        .withUrl(getNotificationHubUrl(), {
            accessTokenFactory: () => getToken() || "",
            withCredentials: false,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Warning)
        .build();

    const refreshNotifications = () => {
        if (!stopped && typeof onNotificationChanged === "function") {
            onNotificationChanged();
        }
    };

    connection.on("NotificationChanged", refreshNotifications);

    // ตอน reconnect สำเร็จให้ refresh อีกครั้ง เผื่อมี event เกิดระหว่างหลุด
    connection.onreconnected(() => {
        refreshNotifications();
    });

    const scheduleRestart = () => {
        if (stopped || retryTimer) {
            return;
        }

        retryTimer = window.setTimeout(() => {
            retryTimer = null;
            startConnection();
        }, 5000);
    };

    const startConnection = async () => {
        if (stopped) {
            return;
        }

        try {
            await connection.start();

            // ถ้าเพิ่งเชื่อมสำเร็จ ให้ sync อีกครั้งทันที
            // เผื่อมี notification เกิดระหว่างที่ connection ยังไม่พร้อม
            refreshNotifications();
        } catch (error) {
            if (!stopped) {
                console.warn(
                    "Notification realtime connection failed:",
                    error
                );
                scheduleRestart();
            }
        }
    };

    connection.onclose(() => {
        scheduleRestart();
    });

    startConnection();

    return () => {
        stopped = true;

        if (retryTimer) {
            window.clearTimeout(retryTimer);
            retryTimer = null;
        }

        connection.off("NotificationChanged", refreshNotifications);

        connection.stop().catch(() => {
            // component กำลัง unmount ไม่ต้องรบกวนผู้ใช้ด้วย error
        });
    };
}
