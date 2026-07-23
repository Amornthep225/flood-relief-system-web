import Link from "next/link";
import CenterStatusBadge from "./CenterStatusBadge";

function getLocation(center) {
    return [
        center.subDistrict,
        center.district,
        center.province,
    ]
        .filter(Boolean)
        .join(", ");
}

export default function AdminCentersTable({
    centers,
    deletingId,
    onEdit,
    onDelete,
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <th className="w-20 p-4 font-bold">
                                ID
                            </th>
                            <th className="p-4 font-bold">
                                ข้อมูลจุดรับบริจาค
                            </th>
                            <th className="p-4 font-bold">
                                ผู้ดูแล
                            </th>
                            <th className="p-4 text-center font-bold">
                                สถานะ
                            </th>
                            <th className="p-4 text-right font-bold">
                                จัดการ
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">
                        {centers.map(
                            (center) => (
                                <tr
                                    key={
                                        center.id
                                    }
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="p-4 font-mono text-slate-400">
                                        {
                                            center.id
                                        }
                                    </td>

                                    <td className="p-4">
                                        <p className="font-bold text-slate-800">
                                            {
                                                center.centerName
                                            }
                                        </p>

                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                                            <span className="material-symbols-outlined text-sm">
                                                location_on
                                            </span>

                                            {getLocation(
                                                center
                                            ) ||
                                                center.address ||
                                                "-"}
                                        </p>
                                    </td>

                                    <td className="p-4">
                                        <p className="font-medium text-slate-700">
                                            {
                                                center.contactName
                                            }
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {
                                                center.phoneNumber
                                            }
                                        </p>
                                    </td>

                                    <td className="p-4 text-center">
                                        <CenterStatusBadge
                                            status={
                                                center.status
                                            }
                                        />
                                    </td>

                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin/admin-center-inventory?centerId=${encodeURIComponent(
                                                    center.id
                                                )}`}
                                                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-sky-500"
                                                title="ดูคลัง"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    inventory_2
                                                </span>
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit(
                                                        center
                                                    )
                                                }
                                                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-teal-600"
                                                title="แก้ไข"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    edit_square
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(
                                                        center
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    center.id
                                                }
                                                className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                title="ลบ"
                                            >
                                                <span
                                                    className={`material-symbols-outlined text-[18px] ${
                                                        deletingId ===
                                                        center.id
                                                            ? "animate-spin"
                                                            : ""
                                                    }`}
                                                >
                                                    {deletingId ===
                                                    center.id
                                                        ? "progress_activity"
                                                        : "delete"}
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
