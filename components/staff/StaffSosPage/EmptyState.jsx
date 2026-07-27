const content = {
    waiting: {
        icon: "pending_actions",
        title: "ไม่มีคำขอที่รอรับเรื่อง",
        description:
            "ขณะนี้ไม่มีคำขอใหม่ที่รอเจ้าหน้าที่รับผิดชอบ",
    },
    progress: {
        icon: "local_shipping",
        title: "ไม่มีงานที่กำลังดำเนินการ",
        description:
            "งานที่คุณรับผิดชอบจะแสดงในส่วนนี้",
    },
    completed: {
        icon: "task_alt",
        title: "ยังไม่มีงานที่เสร็จสิ้น",
        description:
            "ภารกิจที่ดำเนินการสำเร็จจะแสดงในส่วนนี้",
    },
};

export default function EmptyState({ activeTab }) {
    const current =
        content[activeTab] || content.waiting;

    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <span className="material-symbols-outlined text-3xl">
                    {current.icon}
                </span>
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-700">
                {current.title}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
                {current.description}
            </p>
        </div>
    );
}