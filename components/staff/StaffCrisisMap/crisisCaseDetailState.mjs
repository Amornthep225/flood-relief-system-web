function normalizeText(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    const text = String(value).trim();
    return text || fallback;
}

export function normalizeCrisisCaseDetail(rawDetail, fallback = {}) {
    const detail = rawDetail?.data ?? rawDetail ?? {};

    return {
        ...fallback,
        id: detail.id ?? fallback.id ?? detail.sosRequestId ?? detail.requestId ?? "",
        userId: detail.userId ?? fallback.userId ?? "",
        userName:
            detail.userFullName ??
            detail.userName ??
            detail.fullName ??
            fallback.userName ??
            "ไม่ระบุชื่อ",
        phone:
            detail.userPhoneNumber ??
            detail.userPhone ??
            detail.phoneNumber ??
            fallback.phone ??
            "-",
        userEmail: detail.userEmail ?? fallback.userEmail ?? "",
        latitude: Number(detail.latitude ?? fallback.latitude ?? 0),
        longitude: Number(detail.longitude ?? fallback.longitude ?? 0),
        address:
            detail.addressDetail ??
            detail.address ??
            fallback.address ??
            "ไม่ระบุสถานที่",
        requestType: detail.requestType ?? fallback.requestType ?? "Relief",
        priority: detail.priority ?? fallback.priority ?? "Normal",
        status: detail.status ?? fallback.status ?? "Pending",
        centerId: detail.centerId ?? fallback.centerId ?? "",
        centerName: detail.centerName ?? fallback.centerName ?? "ยังไม่ระบุศูนย์",
        centerPhoneNumber:
            detail.centerPhoneNumber ?? fallback.centerPhoneNumber ?? "",
        assignedStaffId:
            detail.assignedStaffId ?? fallback.assignedStaffId ?? null,
        assignedStaffName:
            detail.assignedStaffName ?? fallback.assignedStaffName ?? null,
        assignedStaffPhoneNumber:
            detail.assignedStaffPhoneNumber ??
            fallback.assignedStaffPhoneNumber ??
            "",
        createdAt: detail.createdAt ?? fallback.createdAt ?? null,
        updatedAt: detail.updatedAt ?? fallback.updatedAt ?? null,
        acceptedAt: detail.acceptedAt ?? fallback.acceptedAt ?? null,
        deliveringAt: detail.deliveringAt ?? fallback.deliveringAt ?? null,
        completedAt: detail.completedAt ?? fallback.completedAt ?? null,
        remark:
            detail.userRemark ??
            detail.remark ??
            fallback.remark ??
            "",
        staffRemark: detail.staffRemark ?? fallback.staffRemark ?? "",
        emergencyType:
            detail.emergencyType ?? fallback.emergencyType ?? "",
        emergencyDetail:
            detail.emergencyDetail ?? fallback.emergencyDetail ?? "",
        victimCount: Number(detail.victimCount ?? fallback.victimCount ?? 0),
        childCount: Number(detail.childCount ?? fallback.childCount ?? 0),
        elderlyCount: Number(detail.elderlyCount ?? fallback.elderlyCount ?? 0),
        disabledCount: Number(detail.disabledCount ?? fallback.disabledCount ?? 0),
        patientCount: Number(detail.patientCount ?? fallback.patientCount ?? 0),
        waterLevel:
            detail.waterLevel === undefined || detail.waterLevel === null
                ? fallback.waterLevel ?? null
                : Number(detail.waterLevel),
        items: Array.isArray(detail.items)
            ? detail.items
            : Array.isArray(fallback.items)
              ? fallback.items
              : [],
    };
}

export function getCrisisCaseDetailPresentation(caseItem) {
    const isEmergency =
        normalizeText(caseItem?.requestType).toLowerCase() === "emergency";

    return {
        isEmergency,
        typeLabel: isEmergency ? "SOS" : "ขอรับของ",
        showPriority: isEmergency,
        priorityLabel: isEmergency ? "วิกฤต" : "",
        showEmergencyInfo: isEmergency,
        showItems: !isEmergency,
    };
}

export function formatCrisisCaseStatus(status) {
    const value = normalizeText(status).toLowerCase();
    const labels = {
        pending: "รอรับงาน",
        accepted: "รับเรื่องแล้ว",
        preparing: "กำลังจัดเตรียม",
        delivering: "กำลังดำเนินการ/เดินทาง",
        completed: "เสร็จสิ้น",
        cancelled: "ยกเลิก",
        rejected: "ปฏิเสธ",
    };

    return labels[value] ?? normalizeText(status, "ไม่ระบุ");
}
