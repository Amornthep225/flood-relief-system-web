"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import {
    createSosRequest,
    getActiveReliefCategories,
    getActiveReliefItems,
} from "@/services/user/sos";

import FormSectionTitle from "@/components/user/SosForm/FormSectionTitle";
import SosCategorySelector from "@/components/user/SosForm/SosCategorySelector";
import SosItemSelector from "@/components/user/SosForm/SosItemSelector";
import LocationPicker from "@/components/user/SosForm/LocationPicker";
import ConfirmSosModal from "@/components/user/SosForm/ConfirmSosModal";

const initialLocation = {
    latitude: null,
    longitude: null,
    addressDetail: "",
};

export default function SosRequestForm() {
    const router = useRouter();

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);

    const [
        selectedCategoryIds,
        setSelectedCategoryIds,
    ] = useState([]);

    const [selectedItemIds, setSelectedItemIds] =
        useState([]);

    const [quantities, setQuantities] = useState({});

    const [
        reliefBagQuantity,
    ] = useState(1);

    const [userRemark, setUserRemark] = useState("");
    const [location, setLocation] =
        useState(initialLocation);

    const [loadingData, setLoadingData] =
        useState(true);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [showConfirm, setShowConfirm] =
        useState(false);

    const itemsByCategory = useMemo(() => {
        return items.reduce((result, item) => {
            const categoryId =
                item.reliefCategoryId;

            if (!result[categoryId]) {
                result[categoryId] = [];
            }

            result[categoryId].push(item);

            return result;
        }, {});
    }, [items]);

    useEffect(() => {
        const loadReliefData = async () => {
            try {
                setLoadingData(true);

                const [
                    categoryResponse,
                    itemResponse,
                ] = await Promise.all([
                    getActiveReliefCategories(),
                    getActiveReliefItems(),
                ]);

                setCategories(
                    Array.isArray(categoryResponse)
                        ? categoryResponse
                        : []
                );

                setItems(
                    Array.isArray(itemResponse)
                        ? itemResponse
                        : []
                );
            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    title: "โหลดข้อมูลไม่สำเร็จ",
                    text:
                        error.message ||
                        "ไม่สามารถโหลดรายการสิ่งของได้",
                });
            } finally {
                setLoadingData(false);
            }
        };

        loadReliefData();
    }, []);

    const toggleCategory = (categoryId) => {
        const isSelected =
            selectedCategoryIds.includes(categoryId);

        if (!isSelected) {
            setSelectedCategoryIds(
                (previous) => [
                    ...previous,
                    categoryId,
                ]
            );

            return;
        }

        const categoryItemIds = items
            .filter(
                (item) =>
                    item.reliefCategoryId ===
                    categoryId
            )
            .map((item) => item.id);

        setSelectedCategoryIds((previous) =>
            previous.filter(
                (id) => id !== categoryId
            )
        );

        setSelectedItemIds((previous) =>
            previous.filter(
                (id) =>
                    !categoryItemIds.includes(id)
            )
        );

        setQuantities((previous) => {
            const updated = { ...previous };

            categoryItemIds.forEach((id) => {
                delete updated[id];
            });

            return updated;
        });
    };

    const toggleItem = (itemId) => {
        const isSelected =
            selectedItemIds.includes(itemId);

        if (isSelected) {
            setSelectedItemIds((previous) =>
                previous.filter(
                    (id) => id !== itemId
                )
            );

            setQuantities((previous) => {
                const updated = { ...previous };
                delete updated[itemId];
                return updated;
            });

            return;
        }

        setSelectedItemIds((previous) => [
            ...previous,
            itemId,
        ]);

        setQuantities((previous) => ({
            ...previous,
            [itemId]: 1,
        }));
    };

    const increaseQuantity = (itemId) => {
        setQuantities((previous) => ({
            ...previous,
            [itemId]:
                Number(previous[itemId] || 1) + 1,
        }));
    };

    const decreaseQuantity = (itemId) => {
        setQuantities((previous) => ({
            ...previous,
            [itemId]: Math.max(
                Number(previous[itemId] || 1) - 1,
                1
            ),
        }));
    };

    const updateQuantity = (itemId, value) => {
        const numberValue = Number(value);

        setQuantities((previous) => ({
            ...previous,
            [itemId]:
                Number.isFinite(numberValue) &&
                    numberValue >= 1
                    ? Math.floor(numberValue)
                    : 1,
        }));
    };

    const validateForm = async () => {
        if (selectedItemIds.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "กรุณาเลือกรายการสิ่งของ",
                text: "ต้องเลือกสิ่งของอย่างน้อย 1 รายการ",
            });

            return false;
        }
        console.log(location);
        if (
            location.latitude === null ||
            location.longitude === null
        ) {
            await Swal.fire({
                icon: "warning",
                title: "กรุณาปักหมุดตำแหน่ง",
                text: "เจ้าหน้าที่ต้องใช้พิกัดในการค้นหาตำแหน่งของคุณ",
            });

            return false;
        }

        if (!location.addressDetail.trim()) {
            await Swal.fire({
                icon: "warning",
                title: "กรุณาระบุรายละเอียดสถานที่",
                text: "เช่น บ้านเลขที่ หมู่บ้าน หรือจุดสังเกต",
            });

            return false;
        }

        return true;
    };

    const openConfirmModal = async () => {
        const isValid = await validateForm();

        if (!isValid) {
            return;
        }

        setShowConfirm(true);
    };

    const handleSubmit = async () => {
    if (isSubmitting) {
        return;
    }
    setIsSubmitting(true);

    try {

        const payload = {

            latitude:
                Number(location.latitude),

            longitude:
                Number(location.longitude),

            addressDetail:
                location.addressDetail.trim(),

            userRemark:
                userRemark.trim() || null,


            items:
                selectedItemIds.map(
                    (itemId) => ({

                        reliefItemId: itemId,

                        quantity:
                            Number(
                                quantities[itemId]
                            ) || 1

                    })
                )
        };


        const response =
            await createSosRequest(payload);



        setShowConfirm(false);



        await Swal.fire({

            icon:"success",

            title:"ส่งคำขอสำเร็จ",

            text:
                `รหัสคำขอ: ${response.sosRequestId}`,

            timer:1500,

            showConfirmButton:false,

            allowOutsideClick:false

        });



        router.push(
            `/user/sos-success?id=${response.sosRequestId}`
        );



    } catch(error){


        if(
            error.message.includes("Token") ||
            error.message.includes("เข้าสู่ระบบใหม่")
        ){

            localStorage.removeItem("token");
            localStorage.removeItem("user");


            await Swal.fire({

                icon:"warning",

                title:"เซสชันหมดอายุ",

                text:error.message

            });


            router.replace(
                "/user/users-login"
            );


            return;

        }



        await Swal.fire({

            icon:"error",

            title:"ส่งคำขอไม่สำเร็จ",

            text:
                error.message ||
                "เกิดข้อผิดพลาด"

        });



    } finally {

        setIsSubmitting(false);

    }

};

    if (loadingData) {
        return (
            <div className="min-h-[500px] flex flex-col items-center justify-center gap-4 text-slate-500">
                <span className="material-symbols-outlined text-5xl animate-spin text-sky-500">
                    progress_activity
                </span>

                <p className="font-medium">
                    กำลังโหลดข้อมูลสิ่งของ...
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="mx-auto w-full max-w-4xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-500">
                        <span className="material-symbols-outlined text-4xl">
                            emergency
                        </span>
                    </div>

                    <h1 className="text-3xl font-black text-slate-800">
                        แจ้งขอความช่วยเหลือ SOS
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        กรุณากรอกข้อมูลให้ครบถ้วน
                        เพื่อให้เจ้าหน้าที่สามารถช่วยเหลือได้รวดเร็ว
                    </p>
                </div>

                <form
                    onSubmit={(event) =>
                        event.preventDefault()
                    }
                    className="space-y-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-sky-100/50 md:p-10"
                >
                    <section className="space-y-5">
                        <FormSectionTitle
                            number="1"
                            title="เลือกหมวดหมู่สิ่งของ"
                            description="เลือกได้มากกว่า 1 หมวดหมู่"
                        />

                        <SosCategorySelector
                            categories={categories}
                            selectedCategoryIds={
                                selectedCategoryIds
                            }
                            onToggle={toggleCategory}
                        />
                    </section>

                    {selectedCategoryIds.length >
                        0 && (
                            <section className="space-y-5">
                                <FormSectionTitle
                                    number="2"
                                    title="เลือกรายการและจำนวน"
                                    description="ระบุจำนวนสิ่งของที่ต้องการ"
                                />

                                <SosItemSelector
                                    categories={categories}
                                    itemsByCategory={
                                        itemsByCategory
                                    }
                                    selectedCategoryIds={
                                        selectedCategoryIds
                                    }
                                    selectedItemIds={
                                        selectedItemIds
                                    }
                                    quantities={
                                        quantities
                                    }
                                    onToggleItem={
                                        toggleItem
                                    }
                                    onIncrease={
                                        increaseQuantity
                                    }
                                    onDecrease={
                                        decreaseQuantity
                                    }
                                    onQuantityChange={
                                        updateQuantity
                                    }
                                />
                            </section>
                        )}


                    <section className="space-y-5">
                        <FormSectionTitle
                            number="3"
                            title="ตำแหน่งรับความช่วยเหลือ"
                            description="ใช้พิกัดปัจจุบันและระบุรายละเอียดสถานที่"
                        />

                        <LocationPicker
                            location={location}
                            onLocationChange={
                                setLocation
                            }
                        />
                    </section>

                    <section className="space-y-5">
                        <FormSectionTitle
                            number="4"
                            title="หมายเหตุเพิ่มเติม"
                            description="ข้อมูลผู้ประสบภัยหรือความต้องการเร่งด่วน"
                        />

                        <textarea
                            rows={4}
                            maxLength={500}
                            value={userRemark}
                            onChange={(event) =>
                                setUserRemark(
                                    event.target.value
                                )
                            }
                            placeholder="เช่น มีเด็กเล็ก ผู้สูงอายุ ผู้ป่วยติดเตียง หรือมีระดับน้ำสูง"
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        />

                        <p className="text-right text-xs text-slate-400">
                            {userRemark.length}/500
                        </p>
                    </section>

                    <button
                        type="button"
                        onClick={openConfirmModal}
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined">
                            emergency
                        </span>

                        ส่งข้อมูลแจ้งขอความช่วยเหลือ
                    </button>
                </form>
            </div>

            {showConfirm && (
                <ConfirmSosModal
                    isSubmitting={isSubmitting}
                    selectedItemCount={
                        selectedItemIds.length
                    }
                    onClose={() => {
                        if (!isSubmitting) {
                            setShowConfirm(false);
                        }
                    }}
                    onConfirm={handleSubmit}
                />
            )}
        </>
    );
}