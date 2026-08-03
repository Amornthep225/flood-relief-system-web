export default function ReportHeader({title,refCode}){
    return <div className="mb-6 flex flex-col gap-4 border-b-2 border-slate-800 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800 text-white">
                <span className="material-symbols-outlined text-4xl">water_drop</span>
            </div>
            <div>
                <h1 className="text-2xl font-black">FLOOD RELIEF</h1>
                <p className="text-sm text-slate-500">ศูนย์ประสานงานช่วยเหลือผู้ประสบภัย</p>
            </div>
        </div>
        <div className="sm:text-right">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="font-mono text-xs text-slate-400">Ref: {refCode}</p>
        </div>
    </div>;
}
