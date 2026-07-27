export default function PrioritySelector({
    value,
    onChange,
}) {
    return (
        <section className="space-y-5">
            <select
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            >

                <option value="Normal">
                    🟢 ปกติ
                </option>

                <option value="Urgent">
                    🟠 เร่งด่วน
                </option>

                <option value="Critical">
                    🔴 วิกฤต
                </option>
            </select>
        </section>
    );
}