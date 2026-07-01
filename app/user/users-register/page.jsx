import Link from "next/link";
import  PublicNavbar  from "@/components/common/public-navbar";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";
import { colors } from "@/constants/colors";

const mockData = {
    hotline: "1784",

    links: {
        home: "/",
        login: "/user/users-login",
        registerSuccess: "/user/users-login",
    },
};

export default function RegisterPage() {
    return (
        <div className={`relative min-h-screen flex flex-col font-sans ${colors.login.page}`}>
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-sky-200/20 blur-3xl" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/20 blur-3xl" />
            </div>

            <PublicNavbar />

            <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-10">
                <div className={cards.userRegister.wrapper}>
                    <div className="flex justify-center mb-6">
                        <div className={cards.userRegister.icon}>
                            <span className="material-symbols-outlined text-3xl">
                                volunteer_activism
                            </span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800 mb-1">
                            ลงทะเบียน
                        </h1>
                    </div>

                    <form className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                                ชื่อ-นามสกุล
                            </label>

                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    person
                                </span>

                                <input
                                    type="text"
                                    placeholder="สมชาย ใจดี"
                                    className={cards.userRegister.input}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                                เบอร์โทรศัพท์
                            </label>

                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    smartphone
                                </span>

                                <input
                                    type="tel"
                                    placeholder="08X-XXX-XXXX"
                                    className={cards.userRegister.input}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                                ที่อยู่
                            </label>

                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    location_on
                                </span>

                                <input
                                    type="text"
                                    placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด"
                                    className={cards.userRegister.input}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                                รหัสผ่าน
                            </label>

                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    lock
                                </span>

                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className={cards.userRegister.input}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                                ยืนยันรหัสผ่าน
                            </label>

                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    lock_reset
                                </span>

                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className={cards.userRegister.input}
                                />
                            </div>
                        </div>

                        <Link
                            href={mockData.links.registerSuccess}
                            className={buttons.userRegister.register}
                        >
                            ลงทะเบียน
                        </Link>
                    </form>

                    <div className="relative flex py-6 items-center">
                        <div className="flex-grow border-t border-slate-100" />
                        <span className="mx-4 text-slate-300 text-[10px]">
                            หรือ
                        </span>
                        <div className="flex-grow border-t border-slate-100" />
                    </div>

                    <div className="space-y-3">
                        <button className={buttons.userRegister.line}>
                            <span className="text-xl font-bold">LINE</span>
                            <span>ลงทะเบียนด้วย LINE</span>
                        </button>

                        <Link
                            href={mockData.links.login}
                            className={buttons.userRegister.loginRedirect}
                        >
                            <span className="material-symbols-outlined">
                                login
                            </span>
                            เข้าสู่ระบบ
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}