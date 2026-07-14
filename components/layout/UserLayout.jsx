import { colors } from "@/constants/colors";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import UserNavbar from "@/components/user/UserNavbar/user-navbar";
import PublicFooter from "@/components/common/Footer/PublicFooter";

const theme = colors.role;

export default function UserLayout({
    children,
    backHref = "/select-role",
    homeHref = "/user/sos-home",
    logoutHref = "/user/users-login",
}) {
    return (
        <RoleGuard role="User" storageKey="user" loginPath="/user/users-login">
            <div className={`min-h-screen flex flex-col ${colors.dashboardUserSos.page}`}>
                <UserNavbar
                    theme={theme}
                    hotline="1784"
                    notificationCount={0}
                    homeHref={homeHref}
                    backHref={backHref}
                    logoutHref={logoutHref}
                    options={{
                        back: true,
                        home: false,
                        logout: true,
                        notification: true,
                        profile: true,
                        hotlineButton: true,
                    }}
                />

                <main className="w-full max-w-7xl mx-auto px-6 pt-8 pb-8">
                    {children}
                </main>

                <PublicFooter theme={theme} />
            </div>
        </RoleGuard>
    );
}