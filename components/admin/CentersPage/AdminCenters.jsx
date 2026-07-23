"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import Swal from "sweetalert2";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import {
    createCenter,
    deleteCenter,
    getCenters,
    getLowStockItems,
    updateCenter,
} from "@/services/admin/centers";
import AdminCentersHeader from "./AdminCentersHeader";
import AdminCentersSummary from "./AdminCentersSummary";
import AdminCentersFilters from "./AdminCentersFilters";
import AdminCentersTable from "./AdminCentersTable";
import AdminCentersPagination from "./AdminCentersPagination";
import AdminCentersSkeleton from "./AdminCentersSkeleton";
import AdminCentersEmpty from "./AdminCentersEmpty";
import CenterModal from "./CenterModal";

const PAGE_SIZE = 8;

const EMPTY_FORM = {
    id: "",
    centerName: "",
    address: "",
    provinceId: "",
    districtId: "",
    subDistrictId: "",
    province: "",
    district: "",
    subDistrict: "",
    zipCode: "",
    contactName: "",
    phoneNumber: "",
    latitude: "",
    longitude: "",
    isActive: true,
};

function normalizeArray(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
}

function normalizeCenter(center) {
    return {
        id: center.id ?? center.centerId ?? "",
        centerName:
            center.centerName ??
            center.name ??
            "-",
        address: center.address ?? "",
        provinceId: center.provinceId ?? "",
        districtId: center.districtId ?? "",
        subDistrictId: center.subDistrictId ?? "",
        province: center.province ?? "",
        district: center.district ?? "",
        subDistrict:
            center.subDistrict ?? "",
        zipCode: center.zipCode ?? "",
        contactName:
            center.contactName ??
            center.manager ??
            "-",
        phoneNumber:
            center.phoneNumber ??
            center.phone ??
            "-",
        latitude:
            center.latitude ?? "",
        longitude:
            center.longitude ?? "",
        isActive:
            center.isActive !== false,
    };
}

function getLowStockCenterId(item) {
    return (
        item.centerId ??
        item.center?.id ??
        item.inventory?.centerId ??
        null
    );
}

export default function AdminCenters() {
    const [centers, setCenters] =
        useState([]);
    const [lowStockItems, setLowStockItems] =
        useState([]);
    const [searchText, setSearchText] =
        useState("");
    const [filter, setFilter] =
        useState("all");
    const [page, setPage] = useState(1);
    const [loading, setLoading] =
        useState(true);
    const [saving, setSaving] =
        useState(false);
    const [deletingId, setDeletingId] =
        useState(null);
    const [error, setError] =
        useState("");
    const [modalMode, setModalMode] =
        useState(null);
    const [form, setForm] =
        useState(EMPTY_FORM);

    const loadData = useCallback(
        async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    centersResult,
                    lowStockResult,
                ] = await Promise.allSettled([
                    getCenters(),
                    getLowStockItems(),
                ]);

                if (
                    centersResult.status ===
                    "rejected"
                ) {
                    throw centersResult.reason;
                }

                setCenters(
                    normalizeArray(
                        centersResult.value
                    ).map(normalizeCenter)
                );

                setLowStockItems(
                    lowStockResult.status ===
                    "fulfilled"
                        ? normalizeArray(
                              lowStockResult.value
                          )
                        : []
                );
            } catch (requestError) {
                setCenters([]);
                setLowStockItems([]);
                setError(
                    requestError?.message ||
                        "เกิดข้อผิดพลาดในการโหลดข้อมูล"
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        setPage(1);
    }, [searchText, filter]);

    const lowStockCenterIds = useMemo(
        () =>
            new Set(
                lowStockItems
                    .map(
                        getLowStockCenterId
                    )
                    .filter(Boolean)
                    .map(String)
            ),
        [lowStockItems]
    );

    const displayCenters = useMemo(
        () =>
            centers.map((center) => ({
                ...center,
                status: !center.isActive
                    ? "closed"
                    : lowStockCenterIds.has(
                          String(center.id)
                      )
                      ? "low"
                      : "active",
            })),
        [centers, lowStockCenterIds]
    );

    const filteredCenters = useMemo(() => {
        const keyword = searchText
            .trim()
            .toLowerCase();

        return displayCenters.filter(
            (center) => {
                const text = [
                    center.id,
                    center.centerName,
                    center.address,
                    center.province,
                    center.district,
                    center.subDistrict,
                    center.contactName,
                    center.phoneNumber,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return (
                    (!keyword ||
                        text.includes(
                            keyword
                        )) &&
                    (filter === "all" ||
                        center.status ===
                            filter)
                );
            }
        );
    }, [
        displayCenters,
        searchText,
        filter,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredCenters.length /
                PAGE_SIZE
        )
    );

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const paginatedCenters = useMemo(() => {
        const start =
            (page - 1) * PAGE_SIZE;

        return filteredCenters.slice(
            start,
            start + PAGE_SIZE
        );
    }, [filteredCenters, page]);

    const summary = useMemo(
        () => ({
            totalCenters:
                displayCenters.length,
            activeCenters:
                displayCenters.filter(
                    (center) =>
                        center.status !==
                        "closed"
                ).length,
            lowStockCenters:
                displayCenters.filter(
                    (center) =>
                        center.status ===
                        "low"
                ).length,
            lowStockItems:
                lowStockItems.length,
        }),
        [
            displayCenters,
            lowStockItems,
        ]
    );

    function openAddModal() {
        setForm(EMPTY_FORM);
        setModalMode("add");
    }

    function openEditModal(center) {
        setForm({
            id: center.id,
            centerName:
                center.centerName,
            address: center.address,
            provinceId: center.provinceId ?? "",
            districtId: center.districtId ?? "",
            subDistrictId: center.subDistrictId ?? "",
            province: center.province,
            district: center.district,
            subDistrict:
                center.subDistrict,
            zipCode: center.zipCode,
            contactName:
                center.contactName,
            phoneNumber:
                center.phoneNumber,
            latitude: center.latitude,
            longitude: center.longitude,
            isActive: center.isActive,
        });

        setModalMode("edit");
    }

    function closeModal() {
        if (!saving) {
            setModalMode(null);
            setForm(EMPTY_FORM);
        }
    }

    function buildCreatePayload() {
        return {
            centerName:
                form.centerName.trim(),
            address:
                form.address.trim(),
            provinceId: Number(form.provinceId),
            districtId: Number(form.districtId),
            subDistrictId: Number(form.subDistrictId),
            phoneNumber:
                form.phoneNumber.trim(),
            contactName:
                form.contactName.trim(),
            latitude:
                form.latitude === ""
                    ? 0
                    : Number(
                          form.latitude
                      ),
            longitude:
                form.longitude === ""
                    ? 0
                    : Number(
                          form.longitude
                      ),
        };
    }

    function validatePayload(payload) {
        if (
            !payload.centerName ||
            !payload.address ||
            !payload.provinceId ||
            !payload.districtId ||
            !payload.subDistrictId
        ) {
            throw new Error(
                "กรุณากรอกชื่อศูนย์และที่อยู่ให้ครบถ้วน"
            );
        }

        if (
            form.phoneNumber &&
            !/^\d{9,10}$/.test(
                form.phoneNumber
            )
        ) {
            throw new Error(
                "เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลัก"
            );
        }

        if (
            Number.isNaN(
                payload.latitude
            ) ||
            Number.isNaN(
                payload.longitude
            )
        ) {
            throw new Error(
                "Latitude และ Longitude ต้องเป็นตัวเลข"
            );
        }
    }

    async function saveCenter() {
        try {
            setSaving(true);

            const createPayload =
                buildCreatePayload();

            validatePayload(
                createPayload
            );

            if (modalMode === "edit") {
                await updateCenter(
                    form.id,
                    {
                        ...createPayload,
                        isActive:
                            Boolean(
                                form.isActive
                            ),
                    }
                );
            } else {
                await createCenter(
                    createPayload
                );
            }

            setModalMode(null);
            setForm(EMPTY_FORM);
            await loadData();

            await Swal.fire({
                icon: "success",
                title:
                    modalMode === "edit"
                        ? "แก้ไขข้อมูลสำเร็จ"
                        : "เพิ่มศูนย์สำเร็จ",
                text:
                    modalMode === "edit"
                        ? "ข้อมูลศูนย์ได้รับการอัปเดตแล้ว"
                        : "เพิ่มศูนย์ใหม่เข้าสู่ระบบแล้ว",
                confirmButtonText: "ตกลง",
            });
        } catch (saveError) {
            await Swal.fire({
                icon: "error",
                title: "บันทึกข้อมูลไม่สำเร็จ",
                text:
                    saveError?.message ||
                    "กรุณาลองใหม่อีกครั้ง",
                confirmButtonText: "ตกลง",
            });
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(center) {
        const result =
            await Swal.fire({
                icon: "warning",
                title: "ยืนยันการลบศูนย์",
                html: `ต้องการลบ <strong>${center.centerName}</strong> หรือไม่`,
                showCancelButton: true,
                confirmButtonText:
                    "ลบศูนย์",
                cancelButtonText:
                    "ยกเลิก",
                confirmButtonColor:
                    "#dc2626",
            });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setDeletingId(
                center.id
            );

            await deleteCenter(
                center.id
            );

            await loadData();

            await Swal.fire({
                icon: "success",
                title: "ลบศูนย์สำเร็จ",
                text: "ข้อมูลศูนย์ถูกลบออกจากระบบแล้ว",
                confirmButtonText: "ตกลง",
            });
        } catch (deleteError) {
            await Swal.fire({
                icon: "error",
                title: "ไม่สามารถลบศูนย์ได้",
                text:
                    deleteError?.message ||
                    "ศูนย์นี้อาจมีข้อมูลที่เชื่อมโยงอยู่",
                confirmButtonText: "ตกลง",
            });
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <RoleGuard
            role="Admin"
            storageKey="admin"
            loginPath="/admin-login"
        >
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <AdminCentersHeader
                    onAdd={openAddModal}
                />

                <main className="mx-auto w-full max-w-[1400px] space-y-6 p-4 md:p-8">
                    <AdminCentersSummary
                        summary={summary}
                    />

                    <AdminCentersFilters
                        searchText={
                            searchText
                        }
                        filter={filter}
                        onSearchChange={
                            setSearchText
                        }
                        onFilterChange={
                            setFilter
                        }
                    />

                    {error && (
                        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 md:flex-row md:items-center md:justify-between">
                            <span>
                                {error}
                            </span>

                            <button
                                type="button"
                                onClick={
                                    loadData
                                }
                                className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white"
                            >
                                ลองใหม่
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <AdminCentersSkeleton />
                    ) : filteredCenters.length ===
                      0 ? (
                        <AdminCentersEmpty />
                    ) : (
                        <>
                            <AdminCentersTable
                                centers={
                                    paginatedCenters
                                }
                                deletingId={
                                    deletingId
                                }
                                onEdit={
                                    openEditModal
                                }
                                onDelete={
                                    handleDelete
                                }
                            />

                            <AdminCentersPagination
                                page={page}
                                totalPages={
                                    totalPages
                                }
                                totalItems={
                                    filteredCenters.length
                                }
                                pageSize={
                                    PAGE_SIZE
                                }
                                onPageChange={
                                    setPage
                                }
                            />
                        </>
                    )}
                </main>

                {modalMode && (
                    <CenterModal
                        mode={modalMode}
                        form={form}
                        saving={saving}
                        onFormChange={
                            setForm
                        }
                        onClose={
                            closeModal
                        }
                        onSave={
                            saveCenter
                        }
                    />
                )}
            </div>
        </RoleGuard>
    );
}
