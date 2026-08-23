"use client";

export default function ChatbotFloatingButton({ isOpen, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "ปิดแชทบอท" : "เปิดแชทบอท"}
      aria-expanded={isOpen}
      className="
        fixed bottom-5 right-5 z-[70]
        flex h-14 w-14 items-center justify-center
        rounded-full bg-blue-600 text-white
        shadow-lg transition-all duration-200
        hover:scale-105 hover:bg-blue-700
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-blue-200
      "
    >
      {isOpen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-7 w-7"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 8h10M7 12h7m-9 8 2.7-3.1A8.5 8.5 0 1 1 20 9.5C20 14.2 16.2 18 11.5 18H8l-3 2Z"
          />
        </svg>
      )}

      {!isOpen && (
        <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
      )}
    </button>
  );
}
