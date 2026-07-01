import Link from "next/link";
import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";
import PublicNavbar from "@/components/common/public-navbar";
const theme = colors.blue;
const mockData = {
    hotline: "1784",

    links: {
        home: "/",
        staffHome: "/staff/staff-home",
        register: "/staff/staff-register",
    },
};

export default function StaffLoginPage() {
    return (
        <div className={`relative min-h-screen flex flex-col font-sans ${colors.staffLogin.page}`}>
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-slate-200/50 blur-3xl" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-sky-200/30 blur-3xl" />
            </div>

            <PublicNavbar />

            <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-10">
                <div className={cards.staffLogin.card}>
                    <div className="flex justify-center mb-6">
                        <div className={cards.staffLogin.icon}>
                            <span className="material-symbols-outlined text-4xl">
                                admin_panel_settings
                            </span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800 mb-1">
                            เข้าสู่ระบบ
                        </h1>
                        <p className="text-slate-400 text-xs">
                            สำหรับเจ้าหน้าที่และหน่วยงานที่เกี่ยวข้อง
                        </p>
                    </div>

                    <form className="space-y-4">
                        <InputField
                            label="เบอร์โทรศัพท์ / รหัสเจ้าหน้าที่"
                            icon="badge"
                            type="text"
                            placeholder="ระบุเบอร์โทรศัพท์หรือรหัส"
                        />

                        <InputField
                            label="รหัสผ่าน"
                            icon="lock"
                            type="password"
                            placeholder="••••••••"
                        />

                        <div className="flex items-center justify-between text-xs mt-2">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-slate-700">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                                />
                                <span>จดจำฉันไว้</span>
                            </label>

                            <a
                                href="#"
                                className="text-slate-500 font-semibold hover:text-slate-700 hover:underline"
                            >
                                ลืมรหัสผ่าน?
                            </a>
                        </div>

                        <Link href={mockData.links.staffHome} className={buttons.staffLogin.login}>
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
                        <button className={buttons.staffLogin.line}>
                            <span className="text-xl font-black">LINE</span>
                            <span>เข้าสู่ระบบด้วย LINE</span>
                        </button>

                        <Link href={mockData.links.register} className={buttons.staffLogin.registerLink}>
                            <span className="material-symbols-outlined text-slate-400">
                                error
                            </span>
                            <span>ลงทะเบียนเป็นเจ้าหน้าที่</span>
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
                        <span>ระบบรักษาความปลอดภัยสำหรับเจ้าหน้าที่</span>
                    </div>

                    <a href="#" className="hover:text-slate-600">
                        นโยบายการใช้งาน
                    </a>

                    <a href="#" className="hover:text-slate-600">
                        ความช่วยเหลือ
                    </a>
                </div>
            </footer>
        </div>
    );
}

function InputField({
    label,
    icon,
    type,
    placeholder,
}) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                {label}
            </label>

            <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                    {icon}
                </span>

                <input
                    type={type}
                    placeholder={placeholder}
                    className={cards.staffLogin.input}
                />
            </div>
        </div>
    );
}