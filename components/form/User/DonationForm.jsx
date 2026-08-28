"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import DonorFormHeader from "@/components/user/DonorForm/DonorFormHeader";
import DonorCategorySelector from "@/components/user/DonorForm/DonorCategorySelector";
import DonorItemSelector from "@/components/user/DonorForm/DonorItemSelector";
import ConfirmDonorModal from "@/components/user/DonorForm/ConfirmDonorModal";
import DonorCenterSelector from "@/components/user/DonorForm/DonorCenterSelector";
import DonorImageUpload from "@/components/user/DonorForm/DonorImageUpload";

import { getActiveReliefCategories, getActiveReliefItems } from "@/services/user/sos";
import { createDonation } from "@/services/user/donation";
import { uploadImage } from "@/services/user/upload";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateUiText } from "@/locales/uiPhrases";

export default function DonationForm() {
    const router = useRouter();
    const { language, t } = useLanguage();

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                const [categoryData, itemData] = await Promise.all([
                    getActiveReliefCategories(),
                    getActiveReliefItems(),
                ]);
                setCategories(categoryData);
                setItems(itemData);
            } catch (error) {
                alert(
                    translateUiText(error?.message || "", language) ||
                    t("donation.form.loadError")
                );
            }
        }

        loadData();
    }, []);

    const updateQuantity = (id, value) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Number(value),
        }));
    };

    const filteredItems = useMemo(() => {
        if (!selectedCategory) return [];
        return items.filter(
            (item) => item.reliefCategoryId === selectedCategory
        );
    }, [items, selectedCategory]);

    const selectedItems = useMemo(() => {
        return Object.keys(quantities)
            .filter((id) => quantities[id] > 0)
            .map((id) => ({
                reliefItemId: id,
                quantity: quantities[id],
            }));
    }, [quantities]);

    const submitDonation = async () => {
        if (!selectedCenter) {
            await Swal.fire({
                icon: "warning",
                title: t("donation.form.selectCenterTitle"),
                text: t("donation.form.selectCenterText"),
                confirmButtonColor: "#3b82f6",
            });
            return;
        }

        if (!selectedItems || selectedItems.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: t("donation.form.selectItemsTitle"),
                text: t("donation.form.selectItemsText"),
                confirmButtonColor: "#3b82f6",
            });
            return;
        }

        try {
            setIsSubmitting(true);

            let imageUrl = null;

            if (image) {
                const uploadResult = await uploadImage(image);

                if (!uploadResult?.imageUrl) {
                    throw new Error(t("donation.form.uploadFailed"));
                }

                imageUrl = uploadResult.imageUrl;
            }

            const payload = {
                centerId: selectedCenter,
                imageUrl,
                items: selectedItems,
            };

            const result = await createDonation(payload);

            if (!result?.donationId) {
                throw new Error(t("donation.form.missingDonationId"));
            }

            await Swal.fire({
                icon: "success",
                title: t("donation.form.successTitle"),
                text: t("donation.form.successText"),
                confirmButtonColor: "#3b82f6",
                timer: 1500,
                showConfirmButton: true,
            });

            router.push(`/user/donor-tracking?id=${result.donationId}`);
        } catch (error) {
            console.error("Submit donation error:", error);

            await Swal.fire({
                icon: "error",
                title: t("donation.form.errorTitle"),
                text:
                    translateUiText(error?.message || "", language) ||
                    t("donation.form.submitFailed"),
                confirmButtonColor: "#ef4444",
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
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
            />

            <DonorItemSelector
                items={filteredItems}
                quantities={quantities}
                onChangeQuantity={updateQuantity}
            />

            <DonorCenterSelector
                selectedCenter={selectedCenter}
                onSelect={setSelectedCenter}
            />

            <DonorImageUpload
                image={image}
                onChange={setImage}
            />

            <button
                type="button"
                onClick={() => setShowConfirm(true)}
                disabled={selectedItems.length === 0 || isSubmitting}
                className="w-full rounded-2xl bg-red-500 hover:bg-red-600 active:scale-[0.99] py-4 font-bold text-white shadow-md disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
                {t("donation.form.confirmDonation")}
            </button>

            {showConfirm && (
                <ConfirmDonorModal
                    selectedCount={selectedItems.length}
                    isSubmitting={isSubmitting}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={submitDonation}
                />
            )}
        </div>
    );
}
