export default function FormSectionTitle({
    number,
    title,
    description,
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-sky-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-sky-200">
                {number}
            </div>

            <div>
                <h2 className="text-lg font-bold text-slate-800">
                    {title}
                </h2>

                {description && (
                    <p className="text-sm text-slate-500 mt-1">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}