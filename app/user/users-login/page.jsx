import Link from "next/link";
import  PublicNavbar  from "@/components/common/public-navbar";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";
import { colors } from "@/constants/colors";

const mockData = {
    hotline: "1784",
    links: {
        home: "/",
        selectRole: "/select-role",
        register: "/user/users-register",
        success: "/user/home",
    },
};

export default function UserLoginPage() {
    return (
        <div className={`relative min-h-screen flex flex-col font-sans ${colors.login.page}`}>
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-sky-200/20 blur-3xl" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/20 blur-3xl" />
            </div>
            <PublicNavbar />

            <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-10">
                <div className={cards.userLogin.wrapper}>
                    <div className="flex justify-center mb-6">
                        <div className={cards.userLogin.icon}>
                            <span className="material-symbols-outlined text-3xl">
                                favorite
                            </span>
                        </div>
                    </div>
                    <div className="text-center mb-8">
                        <h1 className={`text-2xl font-bold mb-1 ${colors.login.primaryText}`}>
                            เข้าสู่ระบบ
                        </h1>
                    </div>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                                เบอร์โทรศัพท์
                            </label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">
                                        smartphone
                                    </span>
                                </div>

                                <input
                                    type="tel"
                                    placeholder="08X-XXX-XXXX"
                                    className={cards.userLogin.input}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                                รหัสผ่าน
                            </label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">
                                        lock
                                    </span>
                                </div>

                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className={cards.userLogin.input}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs mt-2">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-slate-700">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                                />
                                <span>จดจำฉันไว้</span>
                            </label>

                            <a
                                href="#"
                                className="text-sky-500 font-semibold hover:text-sky-600 hover:underline"
                            >
                                ลืมรหัสผ่าน?
                            </a>
                        </div>

                        <Link href={mockData.links.selectRole} className={buttons.userLogin.login}>
                            เข้าสู่ระบบ
                        </Link>
                    </form>

                    <div className="relative flex py-6 items-center">
                        <div className="flex-grow border-t border-slate-100" />
                        <span className="flex-shrink-0 mx-4 text-slate-300 text-[10px] font-light">
                            หรือ
                        </span>
                        <div className="flex-grow border-t border-slate-100" />
                    </div>

                    <div className="space-y-3">
                        <a href="#" className={buttons.userLogin.line}>
                            <span className="text-2xl font-black">LINE</span>
                            <span>เข้าสู่ระบบด้วย LINE</span>
                        </a>

                        <Link href={mockData.links.register} className={buttons.userLogin.register}>
                            <span className="material-symbols-outlined text-slate-400">
                                volunteer_activism
                            </span>
                            <span>ลงทะเบียน</span>
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="w-full py-6 text-center">
                <div className="flex justify-center gap-6 text-[10px] text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                            shield
                        </span>
                        <span>ระบบรักษาความปลอดภัยมาตรฐาน SSL</span>
                    </div>

                    <a href="#" className="hover:text-slate-600">
                        นโยบายความเป็นส่วนตัว
                    </a>

                    <a href="#" className="hover:text-slate-600">
                        ช่วยเหลือ
                    </a>
                </div>
            </footer>
        </div>
    );
}