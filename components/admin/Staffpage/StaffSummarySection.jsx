export default function StaffSummarySection({ staffs }) {
    const totalStaff = staffs.length;
    const activeStaff = staffs.filter((staff) => staff.isActive).length;

    return (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SummaryCard
                title="เจ้าหน้าที่ทั้งหมด"
                number={totalStaff}
                icon="groups"
                boxStyle="bg-white border-slate-200"
                textStyle="text-slate-500"
                numberStyle="text-slate-800"
                iconStyle="bg-slate-100 text-slate-500"
            />

            <SummaryCard
                title="ปฏิบัติงานอยู่ (Active)"
                number={activeStaff}
                icon="check_circle"
                boxStyle="bg-green-50 border-green-100"
                textStyle="text-green-600 font-bold"
                numberStyle="text-green-700"
                iconStyle="bg-white text-green-500 animate-pulse"
            />
        </section>
    );
}

function SummaryCard({ title, number, icon, boxStyle, textStyle, numberStyle, iconStyle }) {
    return (
        <div className={`${boxStyle} p-4 rounded-xl border shadow-sm flex items-center justify-between`}>
            <div>
                <p className={`text-xs mb-1 ${textStyle}`}>{title}</p>
                <h3 className={`text-2xl font-bold ${numberStyle}`}>{number}</h3>
            </div>

            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconStyle}`}>
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
            </div>
        </div>
    );
}