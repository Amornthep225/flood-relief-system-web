"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DonorImageUpload({ image, onChange }) {
    const { t } = useLanguage();
    const [preview, setPreview] = useState(image || null);

    useEffect(() => {
        setPreview(image || null);
    }, [image]);

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (preview && preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
        onChange(file);
    };

    const handleRemoveImage = (event) => {
        event.stopPropagation();

        if (preview && preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }

        setPreview(null);
        onChange(null);
    };

    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800">
                    {t("donation.form.imageTitle")}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    {t("donation.form.imageSubtitle")}
                </p>
            </div>

            <label className="group relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-4 transition-all hover:border-slate-400 hover:bg-slate-50/80">
                {preview ? (
                    <div className="relative w-full overflow-hidden rounded-xl">
                        <img
                            src={preview}
                            alt="Donation Preview"
                            className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="flex items-center gap-1.5 rounded-xl bg-red-500/90 px-4 py-2 text-xs font-bold text-white backdrop-blur-xs transition-all hover:bg-red-600 active:scale-95 shadow-md"
                            >
                                <span className="material-symbols-outlined text-base">
                                    delete
                                </span>
                                {t("donation.form.removeImage")}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-500">
                            <span className="material-symbols-outlined text-3xl">
                                add_photo_alternate
                            </span>
                        </div>

                        <p className="mt-3 text-sm font-medium text-slate-600 group-hover:text-slate-800">
                            {t("donation.form.chooseImage")}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            {t("donation.form.imageTypes")}
                        </p>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />
            </label>
        </div>
    );
}
