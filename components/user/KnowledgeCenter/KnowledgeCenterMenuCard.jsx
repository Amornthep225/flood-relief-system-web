import Link from "next/link";

export default function KnowledgeCenterMenuCard() {
  return (
    <Link
      href="/user/users-knowledge"
      className="group block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">📖</div>
      <h3 className="text-lg font-bold text-slate-900">ศูนย์ความรู้ภัยน้ำท่วม</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        คู่มือและคำแนะนำในการเตรียมตัว รับมือ และฟื้นฟูหลังสถานการณ์น้ำท่วม
      </p>
      <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600">
        อ่านคำแนะนำ
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
