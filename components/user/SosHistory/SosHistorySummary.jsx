"use client";

import { cards } from "@/constants/cards";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SosHistorySummary({ summary, historyType = "emergency" }) {
    const { language } = useLanguage();
    const isEmergency = historyType === "emergency";

    const labels =
        language === "en"
            ? isEmergency
                ? {
                      total: "Total SOS requests",
                      completed: "Completed SOS requests",
                      unit: "requests",
                  }
                : {
                      total: "Total relief item requests",
                      completed: "Relief received",
                      unit: "requests",
                  }
            : isEmergency
              ? {
                    total: "SOS ทั้งหมด",
                    completed: "SOS ที่เสร็จสิ้น",
                    unit: "ครั้ง",
                }
              : {
                    total: "คำขอสิ่งของทั้งหมด",
                    completed: "ได้รับความช่วยเหลือแล้ว",
                    unit: "ครั้ง",
                };

    return (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className={cards.userSosHistory.summaryPrimary}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="mb-1 text-sm text-orange-100">
                            {labels.total}
                        </p>

                        <h2 className="text-3xl font-bold">
                            {summary.total}
                            <span className="ml-2 text-sm font-normal">
                                {labels.unit}
                            </span>
                        </h2>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                        <span className="material-symbols-outlined text-2xl">
                            {isEmergency ? "emergency" : "inventory_2"}
                        </span>
                    </div>
                </div>
            </div>

            <div className={cards.userSosHistory.summary}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="mb-1 text-sm text-white">
                            {labels.completed}
                        </p>

                        <h2 className="text-3xl font-bold text-white">
                            {summary.completed}
                            <span className="ml-2 text-sm font-normal text-white">
                                {labels.unit}
                            </span>
                        </h2>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white">
                        <span className="material-symbols-outlined text-2xl">
                            check_circle
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
