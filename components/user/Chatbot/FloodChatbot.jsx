"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

function normalizeText(text) {
    return text.trim().toLowerCase().replace(/\s+/g, " ");
}

export default function FloodChatbot({ embedded = false }) {
    const { language, dictionary, t } = useLanguage();
    const chat = dictionary.chatbot;
    const [messages, setMessages] = useState([{ id: 1, role: "bot", text: chat.greeting }]);
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        setMessages([{ id: 1, role: "bot", text: chat.greeting }]);
        setInput("");
    }, [language, chat.greeting]);

    const nextId = useMemo(() => Math.max(0, ...messages.map((message) => message.id)) + 1, [messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messages]);

    const findAnswer = (message) => {
        const normalized = normalizeText(message);
        const matched = chat.faqs.find((faq) =>
            faq.keywords.some((keyword) => normalized.includes(normalizeText(keyword)))
        );
        if (matched) return matched.answer;
        const isGreeting = chat.greetings.some((greeting) => {
            const normalizedGreeting = normalizeText(greeting);
            if (normalizedGreeting.length <= 2) return normalized === normalizedGreeting;
            return normalized === normalizedGreeting || normalized.startsWith(normalizedGreeting);
        });
        if (isGreeting) return chat.helloResponse;
        return chat.unknown;
    };

    const sendMessage = (rawMessage) => {
        const text = rawMessage.trim();
        if (!text) return;
        setMessages((current) => [
            ...current,
            { id: nextId, role: "user", text },
            { id: nextId + 1, role: "bot", text: findAnswer(text) },
        ]);
        setInput("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage(input);
    };

    return (
        <div className={embedded ? "flex h-[520px] max-h-[65vh] flex-col bg-white" : "mx-auto flex h-[620px] max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"}>
            {!embedded && (
                <div className="border-b border-slate-100 px-5 py-4">
                    <h1 className="font-semibold text-slate-900">{chat.name}</h1>
                    <p className="mt-1 text-sm text-slate-500">{chat.subtitle}</p>
                </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-3">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md bg-slate-100 text-slate-700"}`}>
                                {message.text}
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            </div>

            <div className="border-t border-slate-100 bg-white px-4 py-3">
                <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                    {chat.quickQuestions.map((question) => (
                        <button key={question} type="button" onClick={() => sendMessage(question)} className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100">{question}</button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex items-end gap-2">
                    <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(input); } }} rows={1} placeholder={chat.placeholder} className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-base text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100" />
                    <button type="submit" disabled={!input.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40" aria-label={t("common.sendMessage")}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4 4 16 8-16 8 3-8-3-8Zm3 8h13" /></svg>
                    </button>
                </form>
                <p className="mt-2 text-[11px] leading-4 text-slate-400">{chat.disclaimer}</p>
            </div>
        </div>
    );
}
