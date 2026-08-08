import Link from "next/link";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";
import { colors } from "@/constants/colors";
import UserNavbar from "@/components/user/user-navbar";
const theme = colors.role;
const mockData = {
    hotline: "1784",

    links: {
        contactAgent: "/user/contact-agent",
        home: "/user/sos-home",
        faq: "/info/faq",
    },

    user: {
        name: "คุณ อมรเทพ ถายะ",
        image: "https://ui-avatars.com/api/?name=PA&background=0284c7&color=fff",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai",
        status: "สถานะ: กำลังสนทนา",
    },

    agent: {
        name: "เจ้าหน้าที่ศูนย์ประสานงาน",
        status: "ออนไลน์",
    },

    messages: [
        {
            id: 1,
            type: "agent",
            text: "สวัสดีครับ มีอะไรให้เจ้าหน้าที่ช่วยเหลือแจ้งได้เลยครับ",
            time: "14:02 น.",
        },
        {
            id: 2,
            type: "user",
            text: "ต้องการขอความช่วยเหลือเรื่องถุงยังชีพครับ ตอนนี้ในพื้นที่น้ำเริ่มลดแต่ยังออกไปข้างนอกไม่ได้",
            time: "14:05 น.",
        },
    ],
};

export default function UserChatPage() {
    return (
        <div
            className={`relative min-h-screen flex flex-col font-sans overflow-hidden ${colors.chat.page}`}
        >
            <UserNavbar
                user={mockData.user}
                theme={theme}
                hotline={mockData.hotline}
                notificationCount={3}
                homeHref="/user/sos-home"
                backHref="/user/sos-home"
                logoutHref="/user/users-login"
                options={{
                    back: true,
                    home: false,
                    logout: true,
                    notification: true,
                    profile: true,
                    hotlineButton: true,
                }}
            />

            <main className="flex-grow flex justify-center p-4 md:p-6 h-[calc(100vh-80px)]">
                <div className={cards.userChatBot.container}>
                    <aside className={cards.userChatBot.sidebar}>
                        <div className="p-6 pb-2">
                            <Link
                                href={mockData.links.home}
                                className="text-slate-400 hover:text-slate-600 text-xs font-medium flex items-center gap-2 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">
                                    arrow_back
                                </span>
                                กลับหน้าติดต่อเจ้าหน้าที่
                            </Link>

                            <h2 className="text-xl font-bold text-slate-800 mt-4">
                                ศูนย์ช่วยเหลือ
                            </h2>
                        </div>

                        <div className="flex-1 px-4 space-y-1 mt-4">
                            <Link href="#" className={buttons.userChatBot.menuActive}>
                                <span className="material-symbols-outlined text-[20px]">
                                    chat
                                </span>
                                ประวัติการแชท
                            </Link>

                            <Link href={mockData.links.faq} className={buttons.userChatBot.menu}>
                                <span className="material-symbols-outlined text-[20px]">
                                    help
                                </span>
                                คำถามที่พบบ่อย
                            </Link>
                        </div>

                        <div className="p-4 border-t border-slate-200">
                            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
                                    <span className="material-symbols-outlined text-[20px]">
                                        person
                                    </span>
                                </div>

                                <div className="leading-tight">
                                    <p className="text-sm font-bold text-slate-700">
                                        {mockData.user.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        {mockData.user.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <section className="flex-1 flex flex-col bg-white relative">
                        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                                        <span className="material-symbols-outlined text-[22px]">
                                            support_agent
                                        </span>
                                    </div>

                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">
                                        คุยกับ: {mockData.agent.name}
                                    </h3>
                                    <p className="text-[10px] text-green-500 font-bold">
                                        {mockData.agent.status}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 text-slate-400">
                                <button className={buttons.userChatBot.headerIcon}>
                                    <span className="material-symbols-outlined text-[20px]">
                                        videocam
                                    </span>
                                </button>

                                <button className={buttons.userChatBot.headerIcon}>
                                    <span className="material-symbols-outlined text-[20px]">
                                        call
                                    </span>
                                </button>

                                <button className={buttons.userChatBot.headerIcon}>
                                    <span className="material-symbols-outlined text-[20px]">
                                        more_vert
                                    </span>
                                </button>
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                            <div className="flex justify-center">
                                <span className="text-[10px] text-slate-400 bg-slate-100 px-3 py-1 rounded-full font-medium">
                                    วันนี้
                                </span>
                            </div>

                            {mockData.messages.map((message) =>
                                message.type === "agent" ? (
                                    <AgentMessage
                                        key={message.id}
                                        text={message.text}
                                        time={message.time}
                                    />
                                ) : (
                                    <UserMessage
                                        key={message.id}
                                        text={message.text}
                                        time={message.time}
                                    />
                                )
                            )}

                            <TypingIndicator />
                        </div>

                        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                            <div className={cards.userChatBot.inputBox}>
                                <div className="flex gap-1 px-2 text-slate-400">
                                    <button className={buttons.userChatBot.inputIcon}>
                                        <span className="material-symbols-outlined text-[20px]">
                                            attach_file
                                        </span>
                                    </button>

                                    <button className={buttons.userChatBot.inputIcon}>
                                        <span className="material-symbols-outlined text-[20px]">
                                            image
                                        </span>
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    placeholder="พิมพ์ข้อความของคุณ..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700 placeholder:text-slate-400 px-2 h-10 outline-none"
                                />

                                <button className={buttons.userChatBot.send}>
                                    <span className="material-symbols-outlined text-[20px]">
                                        send
                                    </span>
                                </button>
                            </div>

                            <div className="text-center mt-2">
                                <span className="text-[8px] text-slate-300 uppercase tracking-widest font-semibold">
                                    Flood Relief Coordination Center • Live Support Portal
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

function AgentMessage({ text, time }) {
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-[18px]">
                    support_agent
                </span>
            </div>

            <div className="space-y-1 max-w-[80%]">
                <div className={cards.userChatBot.agentMessage}>{text}</div>
                <span className="text-[10px] text-slate-300 ml-1 block">{time}</span>
            </div>
        </div>
    );
}

function UserMessage({ text, time }) {
    return (
        <div className="flex flex-row-reverse gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-[18px]">person</span>
            </div>

            <div className="space-y-1 max-w-[80%] flex flex-col items-end">
                <div className={cards.userChatBot.userMessage}>{text}</div>
                <span className="text-[10px] text-slate-300 mr-1 block">{time}</span>
            </div>
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center shrink-0" />

            <div>
                <p className="text-[10px] text-slate-400 italic mb-1 ml-1">
                    เจ้าหน้าที่กำลังพิมพ์...
                </p>
            </div>
        </div>
    );
}