const tabs=[
    {value:"donors",label:"รายงานผู้บริจาค",icon:"volunteer_activism"},
    {value:"sos",label:"รายงาน SOS",icon:"crisis_alert"},
    {value:"inventory",label:"รายงานคลัง",icon:"inventory_2"},
];

export default function ReportTabs({value,onChange}){
    return <div className="no-print grid grid-cols-1 gap-2 rounded-2xl border bg-white p-2 shadow-sm sm:grid-cols-3">
        {tabs.map(tab=><button
            key={tab.value}
            onClick={()=>onChange(tab.value)}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
                value===tab.value
                    ?"bg-indigo-600 text-white shadow"
                    :"text-slate-500 hover:bg-slate-50"
            }`}
        >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
        </button>)}
    </div>;
}
