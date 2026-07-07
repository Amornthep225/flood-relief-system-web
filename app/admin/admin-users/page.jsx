"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import AdminUsersHeader from "@/components/admin/Userpage/AdminUsersHeader";
import UserSummarySection from "@/components/admin/Userpage/UserSummarySection";
import UserFilterBar from "@/components/admin/Userpage/UserFilterBar";
import UserTable from "@/components/admin/Userpage/UserTable";
import ManageUserModal from "@/components/admin/Userpage/ManageUserModal";
import { getUsers, updateUserStatus } from "@/services/admin/user";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isBanned, setIsBanned] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setUsers(await getUsers());
        } catch (err) {
            Swal.fire("ผิดพลาด", err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const keyword = searchText.toLowerCase();

        return (
            user.id?.toLowerCase().includes(keyword) ||
            user.fullName?.toLowerCase().includes(keyword) ||
            user.phoneNumber?.toLowerCase().includes(keyword) ||
            user.email?.toLowerCase().includes(keyword)
        );
    });

    const openManageModal = (user) => {
        setSelectedUser(user);
        setIsBanned(!user.isActive);
    };

    const saveManage = async () => {
        setIsSaving(true);

        try {
            await updateUserStatus(selectedUser.id, !isBanned);

            await Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                timer: 1000,
                showConfirmButton: false,
            });

            setSelectedUser(null);
            fetchUsers();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "บันทึกไม่สำเร็จ",
                text: err.message,
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <RoleGuard role="Admin" storageKey="admin" loginPath="/admin-login">
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <AdminUsersHeader />

                <main className="p-8 max-w-[1400px] mx-auto w-full">
                    <UserSummarySection users={users} />

                    <UserFilterBar
                        searchText={searchText}
                        setSearchText={setSearchText}
                    />

                    <UserTable
                        users={filteredUsers}
                        totalUsers={users.length}
                        loading={loading}
                        onManage={openManageModal}
                    />
                </main>

                {selectedUser && (
                    <ManageUserModal
                        user={selectedUser}
                        isBanned={isBanned}
                        isSaving={isSaving}
                        onToggle={() => setIsBanned((prev) => !prev)}
                        onClose={() => setSelectedUser(null)}
                        onSave={saveManage}
                    />
                )}
            </div>
        </RoleGuard>
    );
}