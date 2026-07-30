"use client";

import { useEffect, useRef, useState } from "react";

export default function QrScannerModal({ onClose, onDetected }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const timerRef = useRef(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const stopScanner = () => {
            if (timerRef.current) {
                window.clearInterval(timerRef.current);
                timerRef.current = null;
            }

            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        };

        const startScanner = async () => {
            try {
                if (!navigator.mediaDevices?.getUserMedia) {
                    throw new Error("เบราว์เซอร์นี้ไม่รองรับการเปิดกล้อง");
                }

                if (!("BarcodeDetector" in window)) {
                    throw new Error(
                        "เบราว์เซอร์นี้ยังไม่รองรับการอ่าน QR อัตโนมัติ กรุณาใช้ Chrome หรือกรอกรหัสด้วยตนเอง"
                    );
                }

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: "environment" },
                    },
                    audio: false,
                });

                if (cancelled) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                streamRef.current = stream;
                videoRef.current.srcObject = stream;
                await videoRef.current.play();

                const detector = new window.BarcodeDetector({
                    formats: ["qr_code"],
                });

                timerRef.current = window.setInterval(async () => {
                    if (!videoRef.current || videoRef.current.readyState < 2) {
                        return;
                    }

                    try {
                        const barcodes = await detector.detect(videoRef.current);
                        const rawValue = barcodes?.[0]?.rawValue;

                        if (rawValue) {
                            stopScanner();
                            onDetected(rawValue);
                        }
                    } catch {
                        // ปล่อยให้กล้องสแกนต่อในเฟรมถัดไป
                    }
                }, 500);
            } catch (scannerError) {
                setError(
                    scannerError?.message ||
                        "ไม่สามารถเปิดกล้องเพื่อสแกน QR Code ได้"
                );
            }
        };

        startScanner();

        return () => {
            cancelled = true;
            stopScanner();
        };
    }, [onDetected]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-black text-slate-800">
                            สแกน QR Code
                        </h2>
                        <p className="text-xs text-slate-500">
                            นำ QR Code ของผู้บริจาคมาไว้ในกรอบ
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6">
                    {error ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
                            <span className="material-symbols-outlined mb-2 text-4xl text-amber-500">
                                no_photography
                            </span>
                            <p className="text-sm font-bold text-amber-800">
                                เปิดกล้องไม่สำเร็จ
                            </p>
                            <p className="mt-1 text-sm text-amber-700">{error}</p>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-2xl bg-slate-950">
                            <video
                                ref={videoRef}
                                muted
                                playsInline
                                className="aspect-square w-full object-cover"
                            />
                            <div className="pointer-events-none absolute inset-[15%] rounded-3xl border-4 border-sky-400 shadow-[0_0_0_9999px_rgba(15,23,42,0.45)]" />
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-5 w-full rounded-xl border border-slate-200 py-3 font-bold text-slate-600 hover:bg-slate-50"
                    >
                        ยกเลิก
                    </button>
                </div>
            </div>
        </div>
    );
}
