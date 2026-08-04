import { colors } from "@/constants/colors";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import StaffNavbar from "@/components/staff/StaffNavbar/staff-navbar";

const theme = colors.role;

export default function StaffLayout({
    children,

    homeHref = "/staff/staff-home",
    backHref = "/staff/staff-home",
    logoutHref = "/staff/staff-login",

    pageClass = "bg-mainColorUserPage",
    contentClass = "",

    showHome = true,
    showBack = true,
    showLogout = true,
}) {
    return (
        <RoleGuard role="Staff" storageKey="staff" loginPath="/staff/staff-login">
            <div
                className={`flex min-h-screen flex-col ${pageClass || colors.dashboardUserSos.page
                    }`}
            >
                <StaffNavbar
                    theme={theme}
                    hotline="1784"
                    notificationCount={0}
                    homeHref={homeHref}
                    backHref={backHref}
                    logoutHref={logoutHref}
                    options={{
                        back: showBack,
                        home: showHome,
                        logout: showLogout,
                        notification: true,
                        profile: true,
                        hotlineButton: true,
                    }}
                />

                <main
                    className={`mx-auto w-full max-w-7xl flex-1 px-6 py-8 ${contentClass}`}
                >
                    {children}
                </main>
            </div>
        </RoleGuard>
    );
}
