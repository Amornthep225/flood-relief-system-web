"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import AdminStaffHeader from "@/components/admin/Staffpage/AdminStaffHeader";
import StaffSummarySection from "@/components/admin/Staffpage/StaffSummarySection";
import StaffFilterBar from "@/components/admin/Staffpage/StaffFilterBar";
import StaffTable from "@/components/admin/Staffpage/StaffTable";
import ManageStaffModal from "@/components/admin/Staffpage/ManageStaffModal";
import CreateStaffModal from "@/components/admin/Staffpage/CreateStaffModal";
import { getStaffs, updateStaffStatus, updateStaff } from "@/services/admin/staff";

export default function AdminStaffPage() {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("all");
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isBanned, setIsBanned] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [editForm, setEditForm] = useState({
        centerId: "",
        fullName: "",
        username: "",
        email: "",
        phoneNumber: "",
    });
    const fetchStaffs = async () => {
        try {
            setLoading(true);
            setStaffs(await getStaffs());
        } catch (err) {
            Swal.fire("ผิดพลาด", err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffs();
    }, []);

    const filteredStaffs = staffs.filter((staff) => {
        const keyword = searchText.toLowerCase();

        const matchSearch =
            staff.id?.toLowerCase().includes(keyword) ||
            staff.fullName?.toLowerCase().includes(keyword) ||
            staff.phoneNumber?.toLowerCase().includes(keyword) ||
            staff.email?.toLowerCase().includes(keyword);

        if (filter === "active") return matchSearch && staff.isActive;
        if (filter === "banned") return matchSearch && !staff.isActive;
        return matchSearch;
    });

    const openManageModal = (staff) => {
        setSelectedStaff(staff);
        setIsBanned(!staff.isActive);

        setEditForm({
            centerId: staff.centerId || "",
            fullName: staff.fullName || "",
            username: staff.username || "",
            email: staff.email || "",
            phoneNumber: staff.phoneNumber || "",
        });
    };

    const saveManage = async () => {
        setIsSaving(true);

        try {
            await updateStaff(selectedStaff.id, editForm);
            await updateStaffStatus(selectedStaff.id, !isBanned);

            await Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                timer: 1000,
                showConfirmButton: false,
            });

            setSelectedStaff(null);
            fetchStaffs();
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
    const handleEditChange = (e) => {
        setEditForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    return (
    <RoleGuard role="Admin" storageKey="admin" loginPath="/admin-login">
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <AdminStaffHeader onAddStaff={() => setShowCreateModal(true)} />

            <main className="p-8 max-w-[1400px] mx-auto w-full">
                <StaffSummarySection staffs={staffs} />

                <StaffFilterBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    filter={filter}
                    setFilter={setFilter}
                />

                <StaffTable
                    staffs={filteredStaffs}
                    totalStaff={staffs.length}
                    loading={loading}
                    onManage={openManageModal}
                />
            </main>

            {showCreateModal && (
                <CreateStaffModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => {
                        setShowCreateModal(false);
                        fetchStaffs();
                    }}
                />
            )}

            {selectedStaff && (
                <ManageStaffModal
                    staff={selectedStaff}
                    isBanned={isBanned}
                    isSaving={isSaving}
                    editForm={editForm}
                    onEditChange={handleEditChange}
                    onToggle={() => setIsBanned((prev) => !prev)}
                    onClose={() => setSelectedStaff(null)}
                    onSave={saveManage}
                />
            )}
        </div>
    </RoleGuard>
);
}