"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

import {
    useEffect,
    useRef,
} from "react";
import Chart from "chart.js/auto";

export default function AdminStatusChart({
    waiting,
    progress,
    completed,
}) {
    const { ui } = useNativeUi();
    const canvasRef =
        useRef(null);
    const chartRef =
        useRef(null);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        chartRef.current?.destroy();

        chartRef.current =
            new Chart(
                canvasRef.current,
                {
                    type: "doughnut",
                    data: {
                        labels: [
                            ui("รอการช่วยเหลือ"),
                            ui("กำลังดำเนินการ"),
                            ui("สำเร็จแล้ว"),
                        ],
                        datasets: [
                            {
                                data: [
                                    waiting,
                                    progress,
                                    completed,
                                ],
                                backgroundColor:
                                    [
                                        "#EF4444",
                                        "#3B82F6",
                                        "#10B981",
                                    ],
                                borderWidth:
                                    0,
                                hoverOffset:
                                    4,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio:
                            false,
                        cutout: "72%",
                    },
                }
            );

        return () => {
            chartRef.current?.destroy();
        };
    }, [
        waiting,
        progress,
        completed,
        ui,
    ]);

    return (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800">
                    {ui("สถานะคำขอ")}
                </h3>

                <p className="text-sm text-slate-500">
                    {ui("สัดส่วนสถานะปัจจุบัน")}
                </p>
            </div>

            <div className="relative flex h-80 items-center justify-center p-6">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
}
