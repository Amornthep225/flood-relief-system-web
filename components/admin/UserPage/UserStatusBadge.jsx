export default function UserStatusBadge({ isActive }) {
    if (isActive) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                ใช้งานปกติ
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
            <span className="material-symbols-outlined text-[12px]">block</span>
            ถูกระงับ
        </span>
    );
}