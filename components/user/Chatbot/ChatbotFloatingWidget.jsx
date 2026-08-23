"use client";

import { useState } from "react";
import ChatbotFloatingButton from "./ChatbotFloatingButton";
import FloodChatbot from "./FloodChatbot";

export default function ChatbotFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen((current) => !current);
  };

  return (
    <>
      {isOpen && (
        <div
          className="
            fixed bottom-24 right-4 z-[69]
            w-[calc(100vw-2rem)] max-w-[390px]
            overflow-hidden rounded-2xl
            border border-slate-200 bg-white
            shadow-2xl
            sm:right-5
          "
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="font-semibold text-slate-800">น้องห่วงใย</p>
              <p className="text-xs text-slate-500">
                ผู้ช่วยแนะนำความปลอดภัยช่วงน้ำท่วม
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="ปิดแชทบอท"
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full text-slate-500
                transition hover:bg-slate-100 hover:text-slate-800
              "
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
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="max-h-[65vh] overflow-y-auto">
            <FloodChatbot embedded />
          </div>
        </div>
      )}

      <ChatbotFloatingButton isOpen={isOpen} onClick={toggleChatbot} />
    </>
  );
}
