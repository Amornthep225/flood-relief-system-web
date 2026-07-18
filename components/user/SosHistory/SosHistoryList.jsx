import SosHistoryCard from "./SosHistoryCard";
import SosHistoryState from "./SosHistoryState";

export default function SosHistoryList({
    requests,
    selectedFilter,
}) {
    if (!Array.isArray(requests)) {
        return null;
    }

    if (requests.length === 0) {
        return (
            <SosHistoryState
                icon="history"
                title={getEmptyTitle(
                    selectedFilter
                )}
                description={getEmptyDescription(
                    selectedFilter
                )}
            />
        );
    }

    return (
        <div className="space-y-5">
            {requests.map((request) => (
                <SosHistoryCard
                    key={request.id}
                    request={request}
                />
            ))}
        </div>
    );
}

function getEmptyTitle(filter) {
    if (filter === "active") {
        return "ไม่มีคำขอที่กำลังดำเนินการ";
    }

    if (filter === "completed") {
        return "ยังไม่มีคำขอที่เสร็จสิ้น";
    }

    if (filter === "cancelled") {
        return "ไม่มีคำขอที่ถูกยกเลิก";
    }

    return "ยังไม่มีประวัติคำขอ";
}

function getEmptyDescription(filter) {
    if (filter === "all") {
        return "เมื่อคุณส่งคำขอความช่วยเหลือ รายการจะแสดงที่หน้านี้";
    }

    return "ไม่พบคำขอที่ตรงกับสถานะที่เลือก";
}