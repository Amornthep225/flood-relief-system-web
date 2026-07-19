const STATUS_ORDER = {
    Pending: 0,
    Accepted: 1,
    Preparing: 2,
    Delivering: 3,
    Completed: 4,
};

export default function SosTimeline({ request }) {
    const isCancelled =
        request.status?.toLowerCase() === "cancelled";

    const currentStatusIndex =
        STATUS_ORDER[request.status] ?? 0;

    const steps = [
        {
            key: "Pending",
            title: "ส่งคำขอแล้ว",
            detail: "ระบบได้รับคำขอความช่วยเหลือแล้ว",
            time: request.createdAt,
            icon: "check",
        },
        {
            key: "Accepted",
            title: "เจ้าหน้าที่รับเรื่องแล้ว",
            detail: "เจ้าหน้าที่รับคำขอและกำลังตรวจสอบ",
            time: request.acceptedAt,
            icon: "support_agent",
        },
        {
            key: "Preparing",
            title: "กำลังจัดเตรียม",
            detail: "เจ้าหน้าที่กำลังจัดเตรียมสิ่งของ",
            time: request.preparingAt,
            icon: "inventory_2",
        },
        {
            key: "Delivering",
            title: "กำลังเดินทาง",
            detail: "เจ้าหน้าที่กำลังนำความช่วยเหลือไปส่ง",
            time: request.deliveringAt,
            icon: "local_shipping",
        },
        {
            key: "Completed",
            title: "ช่วยเหลือสำเร็จ",
            detail: "ดำเนินการช่วยเหลือเรียบร้อยแล้ว",
            time: request.completedAt,
            icon: "flag",
        },
    ];

    if (isCancelled) {
        return (
            <div className="space-y-5">
                <TimelineStep
                    title="ส่งคำขอแล้ว"
                    detail="ระบบได้รับคำขอความช่วยเหลือแล้ว"
                    time={request.createdAt}
                    icon="check"
                    state="completed"
                />

                <TimelineStep
                    title="คำขอถูกยกเลิก"
                    detail={
                        request.staffRemark ||
                        "คำขอนี้ถูกยกเลิกแล้ว"
                    }
                    time={request.cancelledAt}
                    icon="cancel"
                    state="cancelled"
                />
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-100" />

            <div className="relative space-y-8">
                {steps.map((step, index) => {
                    const stepIndex =
                        STATUS_ORDER[step.key];

                    let state = "pending";

                    if (stepIndex < currentStatusIndex) {
                        state = "completed";
                    }

                    if (stepIndex === currentStatusIndex) {
                        state =
                            request.status === "Completed"
                                ? "completed"
                                : "active";
                    }

                    return (
                        <TimelineStep
                            key={step.key}
                            title={step.title}
                            detail={step.detail}
                            time={step.time}
                            icon={step.icon}
                            state={state}
                        >
                            {step.key === "Delivering" &&
                                state === "active" &&
                                request.assignedStaffName && (
                                    <CurrentStaffInfo
                                        request={request}
                                    />
                                )}
                        </TimelineStep>
                    );
                })}
            </div>
        </div>
    );
}

function TimelineStep({
    title,
    detail,
    time,
    icon,
    state,
    children,
}) {
    const styles = {
        completed: {
            circle:
                "bg-green-500 border-green-500 text-white shadow-md shadow-green-200",
            title: "text-slate-800",
        },
        active: {
            circle:
                "bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-200",
            title: "text-sky-600 text-base md:text-lg",
        },
        pending: {
            circle:
                "bg-white border-slate-200 text-slate-300",
            title: "text-slate-300",
        },
        cancelled: {
            circle:
                "bg-red-500 border-red-500 text-white shadow-md shadow-red-200",
            title: "text-red-600",
        },
    };

    const currentStyle =
        styles[state] || styles.pending;

    return (
        <div className="relative flex gap-4 items-start">
            <div className="relative w-10 h-10 shrink-0">
                {state === "active" && (
                    <span className="absolute inset-0 rounded-full bg-sky-400 opacity-25 animate-ping" />
                )}

                <div
                    className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${currentStyle.circle}`}
                >
                    <span className="material-symbols-outlined text-xl">
                        {icon}
                    </span>
                </div>
            </div>

            <div className="pt-1 flex-1 min-w-0">
                <h3
                    className={`font-bold text-sm transition-colors ${currentStyle.title}`}
                >
                    {title}
                </h3>

                <p className="text-xs text-slate-400 mt-0.5">
                    {time
                        ? formatThaiDateTime(time)
                        : state === "active"
                          ? detail
                          : "รอดำเนินการ"}
                </p>

                {time && detail && (
                    <p className="text-xs text-slate-400 mt-1">
                        {detail}
                    </p>
                )}

                {children}
            </div>
        </div>
    );
}

function CurrentStaffInfo({ request }) {
    return (
        <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
                <span className="material-symbols-outlined">
                    person
                </span>
            </div>

            <div className="min-w-0">
                <p className="text-xs font-bold text-slate-700 truncate">
                    {request.assignedStaffName}
                </p>

                <p className="text-[10px] text-slate-400 truncate">
                    {request.centerName ||
                        "เจ้าหน้าที่ช่วยเหลือ"}
                </p>
            </div>

            {request.assignedStaffPhoneNumber && (
                <a
                    href={`tel:${request.assignedStaffPhoneNumber}`}
                    className="ml-auto w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors shrink-0"
                    aria-label="โทรหาเจ้าหน้าที่"
                >
                    <span className="material-symbols-outlined text-lg">
                        call
                    </span>
                </a>
            )}
        </div>
    );
}

function formatThaiDateTime(value) {
    if (!value) {
        return "รอดำเนินการ";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}