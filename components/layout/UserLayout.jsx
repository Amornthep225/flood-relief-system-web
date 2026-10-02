import { colors } from "@/constants/colors";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import UserNavbar from "@/components/user/UserNavbar/user-navbar";
import PublicFooter from "@/components/common/Footer/PublicFooter";
import ChatbotFloatingWidget from "@/components/user/Chatbot/ChatbotFloatingWidget";
const theme = colors.role;

export default function UserLayout({
    children,
    backHref = "/select-role",
    homeHref = "/user/sos-home",
    logoutHref = "/user/users-login",
    pageClass = "bg-mainColorUserPage",
    showBack = true,
    showHome = true
}) {
    return (
        <RoleGuard role="User" storageKey="user" loginPath="/user/users-login">
            <div className={`min-h-[100dvh] flex flex-col ${pageClass || colors.dashboardUserSos.page}`}>
                <UserNavbar
                    theme={theme}
                    hotline="1784"
                    homeHref={homeHref}
                    backHref={backHref}
                    logoutHref={logoutHref}
                    options={{
                        back: showBack,
                        home: showHome,
                        logout: true,
                        notification: true,
                        profile: true,
                        hotlineButton: true,
                    }}
                />

                <main className={`w-full max-w-7xl mx-auto px-4 pb-6 pt-5 sm:px-6 sm:pb-8 sm:pt-8 ${pageClass}`}>
                    {children}
                </main>
                
                <ChatbotFloatingWidget />
                <PublicFooter theme={theme} />
            </div>
        </RoleGuard>
    );
}