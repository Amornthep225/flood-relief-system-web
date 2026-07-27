import { colors } from "@/constants/colors";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import PublicFooter from "@/components/common/Footer/PublicFooter";
import StaffNavbar from "@/components/staff/StaffNavbar/staff-navbar";

const theme = colors.role;

export default function StaffLayout({
    children,
    backHref = "/staff/dashboard",
    logoutHref = "/staff/staff-login",
    pageClass = ""
}) {
    return (
        <RoleGuard
            role="Staff"
            storageKey="staff"
            loginPath="/staff/staff-login"
        >
            <div className="min-h-screen flex flex-col bg-[#eef8ff]">
                <StaffNavbar
                    theme={theme}
                    hotline="1784"
                    notificationCount={0}
                    backHref={backHref}
                    logoutHref={logoutHref}
                    options={{
                        back: true,
                        home: true,
                        logout: true,
                        notification: true,
                        profile: true,
                        hotlineButton: true,
                    }}
                />

                <main className="w-full max-w-7xl mx-auto px-6 pt-8 pb-8 flex-1">
                    {children}
                </main>

                <PublicFooter theme={theme} />
            </div>
        </RoleGuard>
    );
}