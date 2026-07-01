"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const mockData = {
    stats: [
        {
            title: "คำขอความช่วยเหลือ",
            number: "18",
            detail: "รอการตอบรับจากเจ้าหน้าที่",
            icon: "warning",
            mainIcon: "cell_tower",
            iconStyle: "bg-red-50 text-red-600",
            badge: "เร่งด่วน",
            badgeStyle: "bg-red-50 text-red-600 animate-pulse",
        },
        {
            title: "ถุงยังชีพที่แจกจ่าย",
            number: "12,450",
            detail: "ชุด",
            icon: "inventory_2",
            mainIcon: "inventory_2",
            iconStyle: "bg-blue-50 text-blue-600",
            badge: "ส่งมอบแล้ว",
            badgeStyle: "bg-slate-100 text-slate-500",
        },
        {
            title: "เจ้าหน้าที่ปฏิบัติงาน",
            number: "42",
            detail: "คน ในพื้นที่ขณะนี้",
            icon: "groups",
            mainIcon: "groups",
            iconStyle: "bg-orange-50 text-orange-600",
            badge: "Online",
            badgeStyle: "bg-orange-50 text-orange-600",
        },
    ],

    activities: [
        {
            title: "แจ้งเตือน SOS #8942",
            detail: "ผู้ป่วยติดเตียง ต้องการเรือมารับด่วน @ แม่สาย",
            time: "2 นาทีที่แล้ว",
            icon: "warning",
            iconStyle: "bg-red-50 text-red-600 border-red-100",
            badge: "วิกฤต",
        },
        {
            title: "เบิกจ่ายถุงยังชีพ",
            detail: 'จนท. สมชาย เบิก "ข้าวสาร" 50 ถุง @ ศูนย์พักพิงวัดดอน',
            time: "15 นาทีที่แล้ว",
            icon: "inventory_2",
            iconStyle: "bg-blue-50 text-blue-600 border-blue-100",
        },
        {
            title: "ปิดงานช่วยเหลือสำเร็จ",
            detail: "เคส #8930 ได้รับอาหารและน้ำดื่มเรียบร้อย",
            time: "45 นาทีที่แล้ว",
            icon: "check_circle",
            iconStyle: "bg-emerald-50 text-emerald-600 border-emerald-100",
        },
        {
            title: "ผู้บริจาคใหม่ลงทะเบียน",
            detail: "คุณ วิชัย เข้าร่วมบริจาคสิ่งของ",
            time: "1 ชม. ที่แล้ว",
            icon: "person_add",
            iconStyle: "bg-orange-50 text-orange-600 border-orange-100",
        },
    ],
};

export default function AdminDashboardPage() {
    const reliefChartRef = useRef(null);
    const statusChartRef = useRef(null);

    useEffect(() => {
        if (!reliefChartRef.current || !statusChartRef.current) return;

        const reliefChart = new Chart(reliefChartRef.current, {
            type: "bar",
            data: {
                labels: ["จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์", "อาทิตย์"],
                datasets: [
                    {
                        label: "แจ้งเข้ามา (Request)",
                        data: [45, 52, 38, 60, 55, 72, 48],
                        backgroundColor: "#DBEAFE",
                        hoverBackgroundColor: "#BFDBFE",
                        borderRadius: 4,
                        barPercentage: 0.6,
                    },
                    {
                        label: "ช่วยเหลือแล้ว (Done)",
                        data: [30, 45, 35, 50, 48, 65, 40],
                        backgroundColor: "#0EA5E9",
                        hoverBackgroundColor: "#0284C7",
                        borderRadius: 4,
                        barPercentage: 0.6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        });

        const statusChart = new Chart(statusChartRef.current, {
            type: "doughnut",
            data: {
                labels: ["รอการช่วยเหลือ", "กำลังดำเนินการ", "สำเร็จแล้ว"],
                datasets: [
                    {
                        data: [18, 45, 279],
                        backgroundColor: ["#EF4444", "#3B82F6", "#10B981"],
                        borderWidth: 0,
                        hoverOffset: 4,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "75%",
            },
        });

        return () => {
            reliefChart.destroy();
            statusChart.destroy();
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="flex items-center justify-between bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Dashboard ภาพรวม</h2>
                    <p className="text-xs text-slate-500">ข้อมูลสถานการณ์ล่าสุดแบบ Real-time</p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full bg-slate-100 text-slate-600 hover:text-sky-500 hover:bg-sky-50 transition-all relative">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                    </button>

                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-700">Admin Staff</p>
                            <p className="text-xs text-slate-500">ศูนย์ประสานงานกลาง</p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 border-2 border-white shadow-sm">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-8 space-y-8 max-w-[1400px] mx-auto w-full">
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mockData.stats.map((item) => (
                        <StatCard key={item.title} item={item} />
                    ))}
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-lg text-slate-800">
                                    สถิติการช่วยเหลือ (Relief Operations)
                                </h4>
                                <p className="text-sm text-slate-500">
                                    เปรียบเทียบคำขอ vs การช่วยเหลือสำเร็จ
                                </p>
                            </div>

                            <select className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-slate-600">
                                <option>7 วันล่าสุด</option>
                                <option>30 วันล่าสุด</option>
                            </select>
                        </div>

                        <div className="p-6 h-80 relative">
                            <canvas ref={reliefChartRef} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="p-6 border-b border-slate-100">
                            <h4 className="font-bold text-lg text-slate-800">สถานะคำขอ (Requests)</h4>
                            <p className="text-sm text-slate-500">สัดส่วนสถานะปัจจุบัน</p>
                        </div>

                        <div className="p-6 h-64 flex justify-center items-center relative">
                            <canvas ref={statusChartRef} />
                        </div>

                        <div className="p-4 bg-slate-50 text-center border-t border-slate-100 rounded-b-2xl">
                            <p className="text-xs text-slate-500">
                                อัปเดตล่าสุด: <span className="font-bold text-slate-700">1 นาทีที่แล้ว</span>
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-lg text-slate-800">กิจกรรมล่าสุด (Live Feed)</h4>
                            <p className="text-sm text-slate-500">ความเคลื่อนไหวในระบบ Real-time</p>
                        </div>

                        <button className="text-xs text-sky-500 font-bold hover:underline">
                            ดูทั้งหมด
                        </button>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {mockData.activities.map((item) => (
                            <ActivityItem key={item.title} item={item} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

function StatCard({ item }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-7xl">{item.mainIcon}</span>
            </div>

            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${item.iconStyle}`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                </div>

                <span className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-full ${item.badgeStyle}`}>
                    {item.badge}
                </span>
            </div>

            <p className="text-slate-500 text-sm font-medium">{item.title}</p>
            <h3 className="text-3xl font-bold mt-1 text-slate-800">{item.number}</h3>
            <p className="text-xs text-slate-400 mt-1">{item.detail}</p>
        </div>
    );
}

function ActivityItem({ item }) {
    return (
        <div className="flex gap-4 p-4 hover:bg-slate-50 transition-colors items-center">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${item.iconStyle}`}>
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            </div>

            <div className="flex-grow">
                <p className="text-sm font-bold text-slate-700">
                    {item.title}
                    {item.badge && (
                        <span className="ml-2 inline-block px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-600">
                            {item.badge}
                        </span>
                    )}
                </p>

                <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
            </div>

            <p className="text-xs text-slate-400 font-medium">{item.time}</p>
        </div>
    );
}