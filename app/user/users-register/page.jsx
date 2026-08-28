"use client";

import PublicNavbar from "@/components/common/public-navbar";
import UserRegisterForm from "@/components/form/User/UserRegisterForm";
import { cards } from "@/constants/cards";
import { colors } from "@/constants/colors";
import { useLanguage } from "@/contexts/LanguageContext";

const links = {
    home: "/",
    login: "/user/users-login",
    registerSuccess: "/user/users-login",
};

export default function RegisterPage() {
    const { t } = useLanguage();

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
                            {t("auth.register.title")}
                        </h1>
                    </div>

                    <UserRegisterForm links={links} />
                </div>
            </main>
        </div>
    );
}
