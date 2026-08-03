
export default function ReliefStatusBadge({isActive}){
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${isActive?"bg-emerald-100 text-emerald-700":"bg-slate-100 text-slate-500"}`}>
    {isActive?"เปิดใช้งาน":"ปิดใช้งาน"}
  </span>;
}
