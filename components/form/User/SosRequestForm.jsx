"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";

import {
    createSosRequest,
    getActiveReliefCategories,
    getActiveReliefItems,
} from "@/services/user/sosPage";

import SosFormHeader from "../../user/SosPage/SosFormHeader";
import SectionTitle from "../../user/SosPage/SectionTitle";
import SosCategorySelector from "../../user/SosPage/SosCategorySelector";
import SosItemSelector from "../../user/SosPage/SosItemSelector";
import ReliefBagInput from "../../user/SosPage/ReliefBagInput";
import LocationPicker from "../../user/SosPage/LocationPicker";
import ConfirmSosModal from "../../user/SosPage/ConfirmSosModal";

export default function SosRequestForm() {
    const router = useRouter();

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [quantities, setQuantities] = useState({});

    const [reliefBagQuantity, setReliefBagQuantity] = useState("");

    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        addressDetail: "",
    });

    const [loadingData, setLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const itemsByCategory = useMemo(() => {
        return items.reduce((result, item) => {
            const categoryId = item.reliefCategoryId;

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

                const [categoryData, itemData] = await Promise.all([
                    getActiveReliefCategories(),
                    getActiveReliefItems(),
                ]);

                setCategories(Array.isArray(categoryData) ? categoryData : []);
                setItems(Array.isArray(itemData) ? itemData : []);
            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    title: "โหลดข้อมูลไม่สำเร็จ",
                    text: error.message,
                });
            } finally {
                setLoadingData(false);
            }
        };

        loadReliefData();
    }, []);

    const toggleCategory = (categoryId) => {
        const isSelected = selectedCategories.includes(categoryId);

        if (isSelected) {
            const categoryItemIds = items
                .filter(
                    (item) => item.reliefCategoryId === categoryId
                )
                .map((item) => item.id);

            setSelectedCategories((previous) =>
                previous.filter((id) => id !== categoryId)
            );

            setSelectedItems((previous) =>
                previous.filter(
                    (itemId) => !categoryItemIds.includes(itemId)
                )
            );

            setQuantities((previous) => {
                const updated = { ...previous };

                categoryItemIds.forEach((itemId) => {
                    delete updated[itemId];
                });

                return updated;
            });

            return;
        }

        setSelectedCategories((previous) => [
            ...previous,
            categoryId,
        ]);
    };

    const toggleItem = (itemId) => {
        const isSelected = selectedItems.includes(itemId);

        if (isSelected) {
            setSelectedItems((previous) =>
                previous.filter((id) => id !== itemId)
            );

            setQuantities((previous) => {
                const updated = { ...previous };
                delete updated[itemId];
                return updated;
            });

            return;
        }

        setSelectedItems((previous) => [...previous, itemId]);

        setQuantities((previous) => ({
            ...previous,
            [itemId]: 1,
        }));
    };

    const updateQuantity = (itemId, value) => {
        const quantity = Math.max(Number(value) || 1, 1);

        setQuantities((previous) => ({
            ...previous,
            [itemId]: quantity,
        }));
    };

    const increaseQuantity = (itemId) => {
        setQuantities((previous) => ({
            ...previous,
            [itemId]: (previous[itemId] || 1) + 1,
        }));
    };

    const decreaseQuantity = (itemId) => {
        setQuantities((previous) => ({
            ...previous,
            [itemId]: Math.max(
                (previous[itemId] || 1) - 1,
                1
            ),
        }));
    };

    const validateForm = () => {
        if (selectedItems.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "กรุณาเลือกรายการสิ่งของ",
                text: "ต้องเลือกรายการสิ่งของอย่างน้อย 1 รายการ",
            });

            return false;
        }

        if (
            !reliefBagQuantity ||
            Number(reliefBagQuantity) < 1
        ) {
            Swal.fire({
                icon: "warning",
                title: "กรุณาระบุจำนวนถุงยังชีพ",
                text: "จำนวนถุงยังชีพต้องมีอย่างน้อย 1 ชุด",
            });

            return false;
        }

        if (
            location.latitude === null ||
            location.longitude === null
        ) {
            Swal.fire({
                icon: "warning",
                title: "กรุณาระบุตำแหน่ง",
                text: "กรุณากดปุ่มปักหมุดตำแหน่งปัจจุบัน",
            });

            return false;
        }

        if (!location.addressDetail.trim()) {
            Swal.fire({
                icon: "warning",
                title: "กรุณาระบุรายละเอียดที่อยู่",
                text: "เช่น บ้านเลขที่ หมู่บ้าน หรือลักษณะจุดสังเกต",
            });

            return false;
        }

        return true;
    };

    const openConfirmModal = () => {
        if (!validateForm()) {
            return;
        }

        setShowConfirm(true);
    };

    const submitSosRequest = async () => {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                centerId: null,
                reliefBagQuantity: Number(reliefBagQuantity),
                latitude: location.latitude,
                longitude: location.longitude,
                addressDetail: location.addressDetail.trim(),
                items: selectedItems.map((itemId) => ({
                    reliefItemId: itemId,
                    quantity: quantities[itemId] || 1,
                })),
            };

            const response = await createSosRequest(payload);

            setShowConfirm(false);

            await Swal.fire({
                icon: "success",
                title: "ส่งคำขอสำเร็จ",
                text: `รหัสคำขอ: ${
                    response.sosRequestId || "-"
                }`,
                timer: 1500,
                showConfirmButton: false,
            });

            sessionStorage.setItem(
                "lastSosRequest",
                JSON.stringify(response)
            );

            router.push(
                `/user/sos-success?id=${response.sosRequestId}`
            );
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "ส่งคำขอไม่สำเร็จ",
                text: error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingData) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <span className="material-symbols-outlined text-4xl animate-spin">
                        progress_activity
                    </span>

                    <p className="text-sm font-medium">
                        กำลังโหลดรายการสิ่งของ...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full max-w-3xl mx-auto">
                <SosFormHeader />

                <form
                    onSubmit={(event) => event.preventDefault()}
                    className={cards.userSosForm.form}
                >
                    <section className="space-y-4">
                        <SectionTitle
                            number="1"
                            title="เลือกสิ่งของที่ต้องการรับความช่วยเหลือ"
                        />

                        <SosCategorySelector
                            categories={categories}
                            selectedCategories={selectedCategories}
                            onToggleCategory={toggleCategory}
                        />

                        {selectedCategories.length > 0 && (
                            <SosItemSelector
                                categories={categories}
                                itemsByCategory={itemsByCategory}
                                selectedCategories={
                                    selectedCategories
                                }
                                selectedItems={selectedItems}
                                quantities={quantities}
                                onToggleItem={toggleItem}
                                onIncrease={increaseQuantity}
                                onDecrease={decreaseQuantity}
                                onQuantityChange={updateQuantity}
                            />
                        )}
                    </section>

                    <section className="space-y-4">
                        <SectionTitle
                            number="2"
                            title="จำนวนชุดถุงยังชีพที่ต้องการ"
                        />

                        <ReliefBagInput
                            value={reliefBagQuantity}
                            onChange={setReliefBagQuantity}
                        />
                    </section>

                    <section className="space-y-4">
                        <SectionTitle
                            number="3"
                            title="พิกัดจัดส่ง / ตำแหน่งของท่าน"
                        />

                        <LocationPicker
                            location={location}
                            onLocationChange={setLocation}
                        />
                    </section>

                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={openConfirmModal}
                            disabled={isSubmitting}
                            className={buttons.userSosForm.submit}
                        >
                            <span className="material-symbols-outlined">
                                send
                            </span>

                            ส่งข้อมูลแจ้งขอความช่วยเหลือ
                        </button>
                    </div>
                </form>
            </div>

            {showConfirm && (
                <ConfirmSosModal
                    isSubmitting={isSubmitting}
                    onClose={() => {
                        if (!isSubmitting) {
                            setShowConfirm(false);
                        }
                    }}
                    onConfirm={submitSosRequest}
                />
            )}
        </>
    );
}