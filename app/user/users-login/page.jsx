import PublicNavbar from "@/components/common/public-navbar";
import UserLoginForm from "@/components/form/User/UserLoginForm";

import { cards } from "@/constants/cards";
import { colors } from "@/constants/colors";

const loginLinks = {
    register: "/user/users-register",
    success: "/select-role",
};

export default function LoginPage() {
    return (
        <div
            className={`relative min-h-screen flex flex-col font-sans ${colors.login.page}`}
        >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-sky-200/20 blur-3xl" />

                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/20 blur-3xl" />
            </div>

            <PublicNavbar />

            <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-10">
                <div className={cards.userLogin.card}>
                    <div className="flex justify-center mb-6">
                        <div className={cards.userLogin.icon}>
                            <span className="material-symbols-outlined text-3xl">
                                favorite
                            </span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800 mb-1">
                            เข้าสู่ระบบ
                        </h1>

                        <p className="text-xs text-slate-400">
                            เข้าสู่ระบบเพื่อใช้งานระบบช่วยเหลือผู้ประสบภัย
                        </p>
                    </div>

                    <UserLoginForm
                        links={loginLinks}
                    />
                </div>
            </main>
        </div>
    );
}