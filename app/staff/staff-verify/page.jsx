"use client";

import { useState } from "react";
import Link from "next/link";
import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";

const mockData = {
    links: {
        home: "/staff/staff-home",
        verifyData: "/staff/staff-verify-data",
    },

    donation: {
        id: "DON-8821",
        donorName: "คุณสมชาย ใจดี",
        phone: "081-XXX-XXXX",
        items: ["บะหมี่กึ่งสำเร็จรูป (2 ลัง)", "น้ำดื่ม 600ml (10 แพ็ค)"],
    },
};

export default function StaffVerifyPage() {
    const [trackingId, setTrackingId] = useState("");
    const [resultId, setResultId] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    const searchDonation = () => {
        const value = trackingId.trim().toUpperCase();

        if (!value) {
            return;
        }

        setResultId(value);
        setShowResult(true);
        setShowScanner(false);
    };

    const fakeScanQr = () => {
        const scannedCode = mockData.donation.id;
        setTrackingId(scannedCode);
        setResultId(scannedCode);
        setShowResult(true);
        setShowScanner(false);
    };

    return (
        <div className={`min-h-screen flex flex-col font-sans ${colors.staffVerify.page}`}>
            <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 sticky top-0 z-50">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-sky-500 rounded-lg w-9 h-9 flex items-center justify-center shadow-lg shadow-sky-500/20">
                            <span className="material-symbols-outlined text-white">
                                admin_panel_settings
                            </span>
                        </div>

                        <div>
                            <h1 className="text-lg font-bold text-white leading-none">
                                STAFF
                            </h1>
                            <p className="text-[10px] text-slate-400">
                                จุดรับบริจาค
                            </p>
                        </div>
                    </div>

                    <Link
                        href={mockData.links.home}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">
                            logout
                        </span>
                    </Link>
                </div>
            </nav>

            <main className="flex-grow p-6 flex flex-col items-center pt-10">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-white">
                            รับของเข้าระบบ
                        </h2>

                        <p className="text-slate-400 text-sm">
                            กรอกรหัสอ้างอิง หรือสแกน QR Code จากผู้บริจาค
                        </p>
                    </div>

                    <div className={cards.staffVerifyCard}>
                        {showScanner ? (
                            <div className="mb-6 relative">
                                <div className="absolute inset-0 z-10 border-4 border-sky-500/50 rounded-xl pointer-events-none" />

                                <div className="w-full h-64 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-slate-400">
                                    <span className="material-symbols-outlined text-6xl text-sky-500 mb-3">
                                        qr_code_scanner
                                    </span>
                                    <p className="text-sm">จำลองหน้ากล้องสแกน QR Code</p>
                                </div>

                                <button
                                    onClick={() => setShowScanner(false)}
                                    className="absolute top-2 right-2 z-20 w-8 h-8 bg-slate-800/80 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        close
                                    </span>
                                </button>

                                <p className="text-center text-xs text-slate-400 mt-2">
                                    นำ QR Code มาไว้ในกรอบ
                                </p>

                                <button
                                    onClick={fakeScanQr}
                                    className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl"
                                >
                                    จำลองการสแกน QR Code
                                </button>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-bold text-sky-500 mb-2 uppercase tracking-wider">
                                    รหัสอ้างอิง (Tracking ID)
                                </label>

                                <div className="relative">
                                    <input
                                        type="text"
                                        value={trackingId}
                                        onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                                        placeholder="DON-XXXX"
                                        className="w-full pl-4 pr-12 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white text-lg font-mono tracking-widest focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none placeholder:text-slate-500 uppercase transition-all"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowScanner(true);
                                            setShowResult(false);
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-800 hover:bg-slate-700 text-sky-500 rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            qr_code
                                        </span>
                                    </button>
                                </div>

                                <button
                                    onClick={searchDonation}
                                    className={buttons.staffVerifySearch}
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        search
                                    </span>
                                    ค้นหาข้อมูล
                                </button>
                            </div>
                        )}
                    </div>

                    {showResult && (
                        <div className={cards.staffVerifyResult}>
                            <div className="bg-emerald-500 p-3 flex justify-between items-center px-6">
                                <span className="text-white font-bold text-sm flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">
                                        check_circle
                                    </span>
                                    พบข้อมูลในระบบ
                                </span>

                                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded font-mono">
                                    {resultId}
                                </span>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 text-xl">
                                        <span className="material-symbols-outlined">
                                            person
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            ผู้บริจาค
                                        </p>
                                        <p className="text-base font-bold text-slate-800">
                                            {mockData.donation.donorName}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {mockData.donation.phone}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                                        รายการเบื้องต้น
                                    </p>

                                    <div className="bg-slate-50 rounded-xl p-4 space-y-1 border border-slate-100 text-sm text-slate-600">
                                        {mockData.donation.items.map((item) => (
                                            <p key={item}>• {item}</p>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Link
                                        href={mockData.links.verifyData}
                                        className={buttons.staffVerifyAction}
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            checklist
                                        </span>
                                        ตรวจสอบรายการและรับของ
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}