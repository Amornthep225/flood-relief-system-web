"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import DonorFormHeader from "@/components/user/DonorForm/DonorFormHeader";
import DonorCategorySelector from "@/components/user/DonorForm/DonorCategorySelector";
import DonorItemSelector from "@/components/user/DonorForm/DonorItemSelector";
import ConfirmDonorModal from "@/components/user/DonorForm/ConfirmDonorModal";
import DonorCenterInfo from "@/components/user/DonorForm/DonorCenterInfo";
import {
    getActiveReliefCategories,
    getActiveReliefItems,
} from "@/services/user/sos";

import { createDonation } from "@/services/user/donation";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateUiText } from "@/locales/uiPhrases";

export default function DonationForm() {
    const router = useRouter();

    const { language, t } = useLanguage();

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);

    const [selectedCategory, setSelectedCategory] =
        useState(null);

    const [quantities, setQuantities] =
        useState({});

    const [showConfirm, setShowConfirm] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    // =====================================================
    // โหลดหมวดหมู่ + รายการที่เปิดรับบริจาค
    // Backend จะเลือก Center Active ให้อัตโนมัติ
    // =====================================================
    useEffect(() => {
        async function loadData() {
            try {
                const [
                    categoryData,
                    itemData,
                ] = await Promise.all([
                    getActiveReliefCategories(),
                    getActiveReliefItems(),
                ]);

                setCategories(
                    Array.isArray(categoryData)
                        ? categoryData
                        : []
                );

                setItems(
                    Array.isArray(itemData)
                        ? itemData.filter(
                              (item) =>
                                  item.isDonationOpen !==
                                      false &&
                                  item.canDonate !==
                                      false
                          )
                        : []
                );
            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    title:
                        t(
                            "donation.form.errorTitle"
                        ),
                    text:
                        translateUiText(
                            error?.message || "",
                            language
                        ) ||
                        t(
                            "donation.form.loadError"
                        ),
                    confirmButtonColor:
                        "#ef4444",
                });
            }
        }

        loadData();
    }, [language, t]);

    // =====================================================
    // อัปเดตจำนวน
    // และไม่ให้กรอกเกิน RemainingQuantity
    // =====================================================
    const updateQuantity = (id, value) => {
        const selectedItem =
            items.find(
                (item) => item.id === id
            );

        let quantity = Number(value);

        if (
            !Number.isFinite(quantity) ||
            quantity < 0
        ) {
            quantity = 0;
        }

        quantity = Math.floor(quantity);

        const remaining =
            selectedItem?.remainingQuantity;

        // remainingQuantity = null
        // หมายถึง MaximumQuantity = 0 / ไม่จำกัด
        if (
            remaining !== null &&
            remaining !== undefined &&
            Number.isFinite(
                Number(remaining)
            )
        ) {
            quantity = Math.min(
                quantity,
                Number(remaining)
            );
        }

        setQuantities((prev) => ({
            ...prev,
            [id]: quantity,
        }));
    };

    // =====================================================
    // รายการตามหมวดหมู่
    // =====================================================
    const filteredItems = useMemo(() => {
        if (!selectedCategory) {
            return [];
        }

        return items.filter(
            (item) =>
                item.reliefCategoryId ===
                selectedCategory
        );
    }, [
        items,
        selectedCategory,
    ]);

    // =====================================================
    // รายการที่ User เลือกบริจาคจริง
    // =====================================================
    const selectedItems = useMemo(() => {
        return Object.keys(quantities)
            .filter(
                (id) =>
                    Number(
                        quantities[id]
                    ) > 0
            )
            .map((id) => ({
                reliefItemId: id,
                quantity: Number(
                    quantities[id]
                ),
            }));
    }, [quantities]);

    // =====================================================
    // Submit Donation
    // ไม่ส่ง centerId แล้ว
    // Backend หา Center Active ให้อัตโนมัติ
    // =====================================================
    const submitDonation =
        async () => {
            if (
                !selectedItems ||
                selectedItems.length === 0
            ) {
                await Swal.fire({
                    icon: "warning",
                    title:
                        t(
                            "donation.form.selectItemsTitle"
                        ),
                    text:
                        t(
                            "donation.form.selectItemsText"
                        ),
                    confirmButtonColor:
                        "#3b82f6",
                });

                return;
            }

            try {
                setIsSubmitting(true);

                const payload = {
                    items: selectedItems,
                };

                const result =
                    await createDonation(
                        payload
                    );

                if (
                    !result?.donationId
                ) {
                    throw new Error(
                        t(
                            "donation.form.missingDonationId"
                        )
                    );
                }

                await Swal.fire({
                    icon: "success",
                    title:
                        t(
                            "donation.form.successTitle"
                        ),
                    text:
                        t(
                            "donation.form.successText"
                        ),
                    confirmButtonColor:
                        "#3b82f6",
                    timer: 1500,
                    showConfirmButton:
                        true,
                });

                router.push(
                    `/user/donor-tracking?id=${result.donationId}`
                );
            } catch (error) {
                console.error(
                    "Submit donation error:",
                    error
                );

                await Swal.fire({
                    icon: "error",
                    title:
                        t(
                            "donation.form.errorTitle"
                        ),
                    text:
                        translateUiText(
                            error?.message || "",
                            language
                        ) ||
                        t(
                            "donation.form.submitFailed"
                        ),
                    confirmButtonColor:
                        "#ef4444",
                });
            } finally {
                setIsSubmitting(false);
                setShowConfirm(false);
            }
        };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <DonorFormHeader />

            <DonorCategorySelector
                categories={categories}
                selectedCategory={
                    selectedCategory
                }
                onSelect={
                    setSelectedCategory
                }
            />

            <DonorItemSelector
                items={filteredItems}
                selectedCategory={selectedCategory}
                quantities={
                    quantities
                }
                onChangeQuantity={
                    updateQuantity
                }
            />
            <DonorCenterInfo />
            <button
                type="button"
                onClick={() =>
                    setShowConfirm(true)
                }
                disabled={
                    selectedItems.length ===
                        0 ||
                    isSubmitting
                }
                className="w-full rounded-2xl bg-red-500 py-4 font-bold text-white shadow-md transition-all hover:bg-red-600 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
            >
                {t(
                    "donation.form.confirmDonation"
                )}
            </button>

            {showConfirm && (
                <ConfirmDonorModal
                    selectedCount={
                        selectedItems.length
                    }
                    isSubmitting={
                        isSubmitting
                    }
                    onClose={() =>
                        setShowConfirm(
                            false
                        )
                    }
                    onConfirm={
                        submitDonation
                    }
                />
            )}
        </div>
    );
}