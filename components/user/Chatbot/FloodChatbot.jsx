"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const FAQS = [
    {
        keywords: ["น้ำท่วมสูง", "น้ำสูง", "น้ำขึ้น", "น้ำเข้าบ้าน"],
        answer:
            "หากระดับน้ำเพิ่มสูงขึ้น ควรย้ายขึ้นพื้นที่สูงหรือจุดที่ปลอดภัย เตรียมเอกสารสำคัญ น้ำดื่ม อาหาร ยาประจำตัว โทรศัพท์ และแบตสำรองไว้ใกล้ตัว หลีกเลี่ยงการเดินหรือขับรถผ่านกระแสน้ำ และเตรียมพร้อมอพยพหากสถานการณ์แย่ลง",
    },
    {
        keywords: ["ไฟฟ้า", "ไฟรั่ว", "ปลั๊ก", "สายไฟ", "ตัดไฟ"],
        answer:
            "ห้ามสัมผัสปลั๊ก สายไฟ หรือเครื่องใช้ไฟฟ้าขณะตัวเปียกหรือยืนอยู่ในน้ำ หากเข้าถึงเมนสวิตช์ได้โดยไม่ต้องลุยน้ำ สามารถปิดกระแสไฟได้ แต่ถ้าเมนสวิตช์อยู่ในพื้นที่น้ำท่วม ไม่ควรเข้าไปปิดด้วยตนเอง",
    },
    {
        keywords: ["น้ำเชี่ยว", "น้ำไหลเชี่ยว", "เดินลุยน้ำ", "ข้ามน้ำ"],
        answer:
            "ควรหลีกเลี่ยงการเดินลุยน้ำที่ไหลแรง เพราะอาจเสียการทรงตัวหรือมีหลุม สิ่งกีดขวาง และสายไฟอยู่ใต้น้ำ หากจำเป็นต้องเคลื่อนย้าย ควรเลือกเส้นทางที่ปลอดภัยและปฏิบัติตามคำแนะนำของเจ้าหน้าที่",
    },
    {
        keywords: ["อพยพ", "หนีน้ำ", "ออกจากบ้าน", "ย้ายออก"],
        answer:
            "ควรอพยพเมื่อพื้นที่เริ่มไม่ปลอดภัย ระดับน้ำเพิ่มต่อเนื่อง หรือได้รับคำแนะนำจากเจ้าหน้าที่ พกเฉพาะของจำเป็น เช่น น้ำ ยา เอกสาร โทรศัพท์ และแบตสำรอง พร้อมช่วยเด็ก ผู้สูงอายุ และผู้ป่วยก่อน",
    },
    {
        keywords: ["เตรียมอะไร", "ของจำเป็น", "กระเป๋าฉุกเฉิน", "เตรียมของ"],
        answer:
            "ของที่ควรเตรียม ได้แก่ น้ำดื่ม อาหารแห้ง ยาประจำตัว ชุดปฐมพยาบาล ไฟฉาย แบตสำรอง โทรศัพท์ เสื้อผ้า เอกสารสำคัญ และถุงหรือภาชนะกันน้ำ",
    },
    {
        keywords: ["อาหาร", "น้ำดื่ม", "น้ำสะอาด", "อาหารเสีย"],
        answer:
            "ควรดื่มน้ำบรรจุขวดที่ปิดสนิทหรือน้ำที่ผ่านการทำให้ปลอดภัยแล้ว และหลีกเลี่ยงอาหารที่สัมผัสน้ำท่วมหรือมีสภาพผิดปกติ หากไม่แน่ใจว่าอาหารปลอดภัยหรือไม่ ควรทิ้ง",
    },
    {
        keywords: ["ขับรถ", "รถ", "รถยนต์", "เดินทาง"],
        answer:
            "ไม่ควรขับรถผ่านบริเวณที่มีน้ำท่วมสูงหรือน้ำไหลแรง เพราะอาจประเมินความลึกผิดและรถอาจดับหรือถูกกระแสน้ำพัด ควรเปลี่ยนเส้นทางหรือรอจนกว่าสถานการณ์จะปลอดภัย",
    },
    {
        keywords: ["เด็ก", "ผู้สูงอายุ", "คนแก่", "ผู้ป่วย"],
        answer:
            "ควรให้เด็ก ผู้สูงอายุ ผู้ป่วย และผู้ที่เคลื่อนไหวลำบากอยู่ในพื้นที่ปลอดภัย เตรียมยาประจำตัวและอุปกรณ์จำเป็นไว้พร้อม และจัดผู้ช่วยดูแลเป็นพิเศษหากต้องอพยพ",
    },
    {
        keywords: ["งู", "สัตว์มีพิษ", "ตะขาบ", "แมงป่อง"],
        answer:
            "ช่วงน้ำท่วมสัตว์อาจหนีน้ำเข้ามาในบ้าน หากพบงูหรือสัตว์มีพิษ อย่าเข้าใกล้ จับ หรือไล่ด้วยตนเอง ควรเว้นระยะห่างและขอความช่วยเหลือจากผู้ที่มีความเชี่ยวชาญ",
    },
    {
        keywords: ["แผล", "บาดแผล", "น้ำสกปรก", "ติดเชื้อ"],
        answer:
            "หลีกเลี่ยงการให้บาดแผลสัมผัสน้ำท่วม หากสัมผัสแล้วควรล้างด้วยน้ำสะอาดและสบู่ เช็ดให้แห้ง และเฝ้าดูอาการผิดปกติ เช่น บวม แดง ร้อน หรือมีหนอง",
    },
    {
        keywords: ["น้ำลด", "หลังน้ำท่วม", "กลับบ้าน", "ทำความสะอาด"],
        answer:
            "หลังน้ำลด ควรตรวจความมั่นคงของอาคารก่อนเข้า สวมรองเท้าและถุงมือขณะทำความสะอาด ระวังของมีคม สัตว์มีพิษ เชื้อรา และอย่าเปิดระบบไฟฟ้าหรือเครื่องใช้ไฟฟ้าที่เปียกน้ำทันที",
    },
    {
        keywords: ["เอกสาร", "โทรศัพท์", "มือถือ", "แบต"],
        answer:
            "ควรเก็บบัตรประชาชน เอกสารสำคัญ โทรศัพท์ และแบตสำรองไว้ในถุงหรือภาชนะกันน้ำ และชาร์จอุปกรณ์สื่อสารให้พร้อมก่อนสถานการณ์รุนแรงขึ้น",
    },
];

const QUICK_QUESTIONS = [
    "น้ำท่วมสูงต้องทำอย่างไร",
    "ไฟฟ้าตอนน้ำท่วม",
    "ควรเตรียมอะไรบ้าง",
    "ควรอพยพเมื่อไหร่",
];

function normalizeText(text) {
    return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function findAnswer(message) {
    const normalized = normalizeText(message);

    const matched = FAQS.find((faq) =>
        faq.keywords.some((keyword) => normalized.includes(normalizeText(keyword)))
    );

    if (matched) {
        return matched.answer;
    }

    if (
        normalized.includes("สวัสดี") ||
        normalized.includes("หวัดดี") ||
        normalized === "hi" ||
        normalized === "hello"
    ) {
        return "สวัสดีครับ 👋 ผมช่วยตอบคำถามทั่วไปเกี่ยวกับการเตรียมตัวและความปลอดภัยในสถานการณ์น้ำท่วมได้ครับ";
    }

    return 'ขออภัยครับ ผมยังไม่พบคำตอบที่ตรงกับคำถามนี้ ลองถามสั้น ๆ เช่น "น้ำท่วมสูงต้องทำอย่างไร", "ไฟฟ้าตอนน้ำท่วม", "ควรเตรียมอะไร" หรือเลือกคำถามแนะนำด้านล่างได้เลยครับ';
}

export default function FloodChatbot({ embedded = false }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "bot",
            text: "สวัสดีครับ 👋 ผมคือน้องห่วงใย สามารถช่วยตอบคำถามทั่วไปเกี่ยวกับความปลอดภัยในสถานการณ์น้ำท่วมได้ครับ",
        },
    ]);
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    const nextId = useMemo(
        () => Math.max(0, ...messages.map((message) => message.id)) + 1,
        [messages]
    );

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messages]);

    const sendMessage = (rawMessage) => {
        const text = rawMessage.trim();
        if (!text) return;

        const userMessage = {
            id: nextId,
            role: "user",
            text,
        };

        const botMessage = {
            id: nextId + 1,
            role: "bot",
            text: findAnswer(text),
        };

        setMessages((current) => [...current, userMessage, botMessage]);
        setInput("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage(input);
    };

    return (
        <div
            className={
                embedded
                    ? "flex h-[520px] max-h-[65vh] flex-col bg-white"
                    : "mx-auto flex h-[620px] max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            }
        >
            {!embedded && (
                <div className="border-b border-slate-100 px-5 py-4">
                    <h1 className="font-semibold text-slate-900">น้องห่วงใย</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        ผู้ช่วยตอบคำถามทั่วไปเกี่ยวกับความปลอดภัยช่วงน้ำท่วม
                    </p>
                </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-3">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user"
                                        ? "rounded-br-md bg-blue-600 text-white"
                                        : "rounded-bl-md bg-slate-100 text-slate-700"
                                    }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}

                    <div ref={bottomRef} />
                </div>
            </div>

            <div className="border-t border-slate-100 bg-white px-4 py-3">
                <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                    {QUICK_QUESTIONS.map((question) => (
                        <button
                            key={question}
                            type="button"
                            onClick={() => sendMessage(question)}
                            className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                        >
                            {question}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex items-end gap-2">
                    <textarea
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();
                                sendMessage(input);
                            }
                        }}
                        rows={1}
                        placeholder="พิมพ์คำถาม เช่น น้ำท่วมสูงต้องทำอย่างไร"
                        className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-base text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="ส่งข้อความ"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4 4 16 8-16 8 3-8-3-8Zm3 8h13"
                            />
                        </svg>
                    </button>
                </form>

                <p className="mt-2 text-[11px] leading-4 text-slate-400">
                    คำตอบเป็นข้อมูลทั่วไป หากสถานการณ์ไม่ปลอดภัย
                    ควรปฏิบัติตามคำแนะนำของเจ้าหน้าที่ในพื้นที่
                </p>
            </div>
        </div>
    );
}
