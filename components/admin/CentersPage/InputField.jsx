export default function InputField({
    label,
    value,
    onChange,
    type = "text",
    required = false,
    maxLength,
    step,
    disabled = false,
}) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-500">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </span>

            <input
                type={type}
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                required={required}
                maxLength={maxLength}
                step={step}
                disabled={disabled}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
            />
        </label>
    );
}
