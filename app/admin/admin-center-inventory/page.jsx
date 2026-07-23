import AdminCenterInventory from "@/components/admin/CenterInventoryPage/AdminInventory";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
export default function AdminCenterInventoryPage() {
    return (
        <RoleGuard role="Admin" storageKey="admin" loginPath="/admin-login">
            <AdminCenterInventory />
        </RoleGuard>
    );
}
