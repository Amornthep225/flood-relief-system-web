"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function ConfirmDonorModal({
    selectedCount,
    isSubmitting,
    onClose,
    onConfirm,
}) {
    const { t } = useLanguage();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
            <div className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-100 bg-white p-4 text-center shadow-xl animate-in fade-in zoom-in-95 duration-200 sm:p-6 lg:p-8">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <span className="material-symbols-outlined text-4xl">
                        volunteer_activism
                    </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-800">
                    {t("donation.form.modal.title")}
                </h2>

                <p className="my-4 text-slate-600 font-medium text-sm">
                    {t("donation.form.modal.description", {
                        count: selectedCount,
                    })}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-xl border border-slate-200 py-3 font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {t("donation.form.modal.back")}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="rounded-xl bg-red-500 hover:bg-red-600 active:scale-[0.98] py-3 font-bold text-white shadow-md shadow-red-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {t("donation.form.modal.sending")}
                            </>
                        ) : (
                            t("donation.form.modal.confirm")
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
