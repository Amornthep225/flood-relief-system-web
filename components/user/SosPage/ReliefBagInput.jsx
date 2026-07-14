export default function ReliefBagInput({ value, onChange }) {
    return (
        <div className="relative max-w-sm">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                inventory_2
            </span>

            <input
                type="number"
                min="1"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="ระบุจำนวนชุด..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-700 shadow-sm"
                required
            />
        </div>
    );
}