"use client";

import {
    useEffect,
    useRef,
} from "react";
import Chart from "chart.js/auto";

export default function AdminReliefChart({
    chartData,
    rangeDays,
    onRangeChange,
}) {
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
                    type: "bar",
                    data: {
                        labels:
                            chartData.labels,
                        datasets: [
                            {
                                label:
                                    "คำขอเข้ามา",
                                data:
                                    chartData.requests,
                                backgroundColor:
                                    "#DBEAFE",
                                hoverBackgroundColor:
                                    "#BFDBFE",
                                borderRadius: 5,
                                barPercentage:
                                    0.65,
                            },
                            {
                                label:
                                    "ช่วยเหลือสำเร็จ",
                                data:
                                    chartData.completed,
                                backgroundColor:
                                    "#0EA5E9",
                                hoverBackgroundColor:
                                    "#0284C7",
                                borderRadius: 5,
                                barPercentage:
                                    0.65,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio:
                            false,
                        scales: {
                            y: {
                                beginAtZero:
                                    true,
                                ticks: {
                                    precision:
                                        0,
                                },
                            },
                        },
                    },
                }
            );

        return () => {
            chartRef.current?.destroy();
        };
    }, [chartData]);

    return (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">
                        สถิติการช่วยเหลือ
                    </h3>

                    <p className="text-sm text-slate-500">
                        เปรียบเทียบคำขอและเคสที่เสร็จสิ้น
                    </p>
                </div>

                <select
                    value={rangeDays}
                    onChange={(event) =>
                        onRangeChange(
                            Number(
                                event.target
                                    .value
                            )
                        )
                    }
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600"
                >
                    <option value={7}>
                        7 วันล่าสุด
                    </option>

                    <option value={30}>
                        30 วันล่าสุด
                    </option>
                </select>
            </div>

            <div className="relative h-80 p-6">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
}
