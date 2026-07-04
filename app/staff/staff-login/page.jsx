import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import PublicNavbar from "@/components/common/public-navbar";
import StaffLoginForm from "@/components/form/Staff/StaffLoginForm/StaffLoginForm";

const mockData = {
    hotline: "1784",
    links: {
        home: "/",
        staffHome: "/staff/staff-home",
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

                    <StaffLoginForm links={mockData.links} />
                </div>
            </main>
        </div>
    );
}