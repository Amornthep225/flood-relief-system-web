import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}