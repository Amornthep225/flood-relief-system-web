"use client";

const STATUS_ORDER = {
    Pending: 0,
    Accepted: 1,
    Preparing: 2,
    Delivering: 3,
    Completed: 4,
};

export default function SosTimeline({ request }) {
    const status = request?.status;
    const isCancelled = status?.toLowerCase() === "cancelled";
    const currentStatusIndex = STATUS_ORDER[status] ?? 0;

    const steps = [
        {
            key: "Pending",
            title: "ส่งคำขอแล้ว",
            detail: "ระบบได้รับคำขอความช่วยเหลือแล้ว",
            time: request?.createdAt,
            icon: "check_circle",
        },
        {
            key: "Accepted",
            title: "เจ้าหน้าที่รับเรื่องแล้ว",
            detail: "เจ้าหน้าที่รับคำขอและกำลังตรวจสอบ",
            time: request?.acceptedAt,
            icon: "support_agent",
        },
        {
            key: "Preparing",
            title: "กำลังจัดเตรียม",
            detail: "เจ้าหน้าที่กำลังจัดเตรียมสิ่งของ",
            time: request?.preparingAt,
            icon: "inventory_2",
        },
        {
            key: "Delivering",
            title: "กำลังเดินทาง",
            detail: "เจ้าหน้าที่กำลังนำความช่วยเหลือไปส่ง",
            time: request?.deliveringAt,
            icon: "local_shipping",
        },
        {
            key: "Completed",
            title: "ช่วยเหลือสำเร็จ",
            detail: "ดำเนินการช่วยเหลือเรียบร้อยแล้ว",
            time: request?.completedAt,
            icon: "flag",
        },
    ];

    if (isCancelled) {
        return (
            <div className="space-y-6 w-full">
                <TimelineStep
                    title="ส่งคำขอแล้ว"
                    detail="ระบบได้รับคำขอความช่วยเหลือแล้ว"
                    time={request?.createdAt}
                    icon="check_circle"
                    state="completed"
                />
                <TimelineStep
                    title="คำขอถูกยกเลิก"
                    detail={request?.staffRemark || "คำขอนี้ถูกยกเลิกแล้ว"}
                    time={request?.cancelledAt}
                    icon="cancel"
                    state="cancelled"
                />
            </div>
        );
    }

    return (
        // ปรับลด Padding ด้านข้างลง (px-3 sm:px-6) เพื่อให้เนื้อหาขยายกว้างชิดขอบนอกได้มากขึ้น
        <div className="relative w-full rounded-3xl bg-sky-50 px-3 py-6 sm:px-6 md:px-8">
            {/* เส้น Timeline: ตั้งค่าผ่ากลางไอคอนวงกลมขนาด w-16 (64px) อย่างแม่นยำ */}
            <div className="absolute left-[20px] sm:left-[32px] md:left-[40px] top-12 bottom-12 w-1 -translate-x-1/2 rounded-full bg-sky-100" />

            <div className="relative space-y-7 w-full">
                {steps.map((step) => {
                    const stepIndex = STATUS_ORDER[step.key];
                    let state = "pending";

                    if (stepIndex < currentStatusIndex) {
                        state = "completed";
                    } else if (stepIndex === currentStatusIndex) {
                        state = status === "Completed" ? "completed" : "active";
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
                                request?.assignedStaffName && (
                                    <CurrentStaffInfo request={request} />
                                )}
                        </TimelineStep>
                    );
                })}
            </div>
        </div>
    );
}

function TimelineStep({ title, detail, time, icon, state, children }) {
    const styles = {
        completed: {
            circle: "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200",
            card: "bg-white border-green-200 ",
            title: "text-green-700",
        },
        active: {
            circle: "bg-sky-500 border-sky-500 text-white shadow-xl shadow-sky-300",
            card: "bg-white border-sky-300",
            title: "text-sky-700",
        },
        pending: {
            circle: "bg-white border-slate-200 text-slate-300",
            card: "bg-white border-slate-100",
            title: "text-slate-400",
        },
        cancelled: {
            circle: "bg-red-500 border-red-500 text-white",
            card: "bg-red-50 border-red-200",
            title: "text-red-600",
        },
    };

    const style = styles[state] || styles.pending;

    return (
        <div className="relative flex items-start gap-3 sm:gap-5 w-full">
            {/* Icon */}
            <div className="relative z-10 shrink-0">
                {state === "active" && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-sky-400 opacity-30" />
                )}

                <div
                    className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 transition-all ${style.circle}`}
                >
                    <span className="material-symbols-outlined text-2xl sm:text-3xl">
                        {icon}
                    </span>
                </div>
            </div>

            {/* Card (ขยายกว้างเต็มพื้นที่ด้วย min-w-0 และ flex-1) */}
            <div
                className={`flex-1 min-w-0 w-full rounded-3xl border p-5 sm:p-6 md:p-7 shadow-sm hover:shadow-md transition mb-4 ${style.card}`}
            >
                <h3 className={`text-base sm:text-lg font-bold ${style.title}`}>
                    {title}
                </h3>

                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-400">
                    {time ? formatThaiDateTime(time) : "รอดำเนินการ"}
                </p>

                <p className="mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
                    {detail}
                </p>

                {children}
            </div>
        </div>
    );
}

function CurrentStaffInfo({ request }) {
    return (
        <div className="mt-5 flex items-center gap-3 sm:gap-4 rounded-2xl bg-slate-50 border border-slate-200 p-3 sm:p-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-white text-sky-500">
                <span className="material-symbols-outlined text-xl sm:text-2xl">
                    person
                </span>
            </div>

            <div className="flex-1 min-w-0">
                <p className="truncate font-bold text-slate-700 text-sm sm:text-base">
                    {request?.assignedStaffName}
                </p>
                <p className="truncate text-xs sm:text-sm text-slate-400">
                    {request?.centerName || "เจ้าหน้าที่ช่วยเหลือ"}
                </p>
            </div>

            {request?.assignedStaffPhoneNumber && (
                <a
                    href={`tel:${request.assignedStaffPhoneNumber}`}
                    aria-label="โทรหาเจ้าหน้าที่"
                    className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow hover:bg-green-600 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg sm:text-xl">
                        call
                    </span>
                </a>
            )}
        </div>
    );
}

function formatThaiDateTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}