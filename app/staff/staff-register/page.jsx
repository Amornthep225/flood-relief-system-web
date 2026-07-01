import Link from "next/link";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";
import { colors } from "@/constants/colors";
import PublicNavbar from "@/components/common/public-navbar";
const theme = colors.blue;
const mockData = {
    hotline: "1784",
    user: {
    name: "คุณ อมรเทพ ถายะ",
        image: "https://ui-avatars.com/api/?name=PA&background=0284c7&color=fff",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai",
    },
    links: {
        home: "/",
        login: "/staff/staff-login",
        registerSuccess: "/staff/staff-login",
    },
};

export default function StaffRegisterPage() {
    return (
        <div className={`relative min-h-screen flex flex-col font-sans ${colors.staffRegister.page}`}>
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-slate-200/50 blur-3xl" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-sky-200/30 blur-3xl" />
            </div>

                        <PublicNavbar />

            <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-10">
                <div className={cards.staffRegister.card}>
                    <div className="flex justify-center mb-6">
                        <div className={cards.staffRegister.icon}>
                            <span className="material-symbols-outlined text-4xl">
                                admin_panel_settings
                            </span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className={`text-2xl font-bold mb-1 ${colors.staffRegister.primaryText}`}>
                            ลงทะเบียนสำหรับเจ้าหน้าที่
                        </h1>
                        <p className={`text-xs ${colors.staffRegister.mutedText}`}>
                            กรุณายืนยันตัวตนเพื่อเข้าใช้งานระบบบริหารจัดการ
                        </p>
                    </div>

                    <form className="space-y-4">
                        <InputField
                            label="เลขบัตรประชาชน"
                            icon="badge"
                            type="text"
                            placeholder="X-XXXX-XXXXX-XX-X"
                        />

                        <InputField
                            label="ชื่อ-นามสกุล"
                            icon="person"
                            type="text"
                            placeholder="ระบุชื่อและนามสกุลจริง"
                        />

                        <InputField
                            label="เบอร์โทรศัพท์"
                            icon="smartphone"
                            type="tel"
                            placeholder="08X-XXX-XXXX"
                        />

                        <InputField
                            label="รหัสผ่าน"
                            icon="lock"
                            type="password"
                            placeholder="••••••••"
                        />

                        <InputField
                            label="ยืนยันรหัสผ่าน"
                            icon="lock_reset"
                            type="password"
                            placeholder="••••••••"
                        />

                        <Link
                            href={mockData.links.registerSuccess}
                            className={buttons.staffRegister.register}
                        >
                            ลงทะเบียน
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
                            <span className="text-xl font-bold">LINE</span>
                            <span>ลงทะเบียนด้วย LINE</span>
                        </button>

                        <div className="text-center pt-2">
                            <p className="text-xs text-slate-400 mb-2">
                                มีบัญชีเจ้าหน้าที่แล้ว?
                            </p>

                            <Link
                                href={mockData.links.login}
                                className={buttons.staffRegister.loginRedirect}
                            >
                                <span className="material-symbols-outlined text-slate-400">
                                    shield_lock
                                </span>
                                <span>เข้าสู่ระบบเจ้าหน้าที่</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="w-full py-6 text-center">
                <div className="flex justify-center gap-6 text-[10px] text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                            shield
                        </span>
                        <span>ระบบรักษาความปลอดภัยระดับองค์กร</span>
                    </div>

                    <a href="#" className="hover:text-slate-600">
                        นโยบายความเป็นส่วนตัว
                    </a>

                    <a href="#" className="hover:text-slate-600">
                        ติดต่อฝ่ายไอที
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
                    className={cards.staffRegister.input}
                />
            </div>
        </div>
    );
}