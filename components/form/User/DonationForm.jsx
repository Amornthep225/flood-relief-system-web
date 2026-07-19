"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import DonorFormHeader from "@/components/user/DonorForm/DonorFormHeader";
import DonorCategorySelector from "@/components/user/DonorForm/DonorCategorySelector";
import DonorItemSelector from "@/components/user/DonorForm/DonorItemSelector";
import ConfirmDonorModal from "@/components/user/DonorForm/ConfirmDonorModal";

import { getActiveReliefCategories, getActiveReliefItems } from "@/services/user/sos";
import { createDonation } from "@/services/user/donation";

export default function DonationForm() {
    const router = useRouter();

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
DonorFormHeader.jsx
    useEffect(() => {
        async function loadData() {
            try {
                const [categoryData, itemData] = await Promise.all([
                    getActiveReliefCategories(),
                    getActiveReliefItems()
                ]);
                setCategories(categoryData);
                setItems(itemData);
            } catch (error) {
                alert(error.message || "โหลดข้อมูลไม่สำเร็จ");
            }
        }
        loadData();
    }, []);

    const updateQuantity = (id, value) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Number(value)
        }));
    };

    // Optimize filter performance using useMemo
    const filteredItems = useMemo(() => {
        if (!selectedCategory) return [];
        return items.filter(item => item.categoryId === selectedCategory);
    }, [items, selectedCategory]);

    // Optimize mapping performance using useMemo
    const selectedItems = useMemo(() => {
        return Object.keys(quantities)
            .filter(id => quantities[id] > 0)
            .map(id => ({
                reliefItemId: id,
                quantity: quantities[id]
            }));
    }, [quantities]);

    const submitDonation = async () => {
        try {
            setIsSubmitting(true);
            await createDonation({ items: selectedItems });

            alert("ส่งข้อมูลบริจาคสำเร็จ");
            router.push("/user/donor-history");
        } catch (error) {
            alert(error.message || "เกิดข้อผิดพลาดในการส่งข้อมูล");
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

            <button
                type="button"
                onClick={() => setShowConfirm(true)}
                disabled={selectedItems.length === 0 || isSubmitting}
                className="w-full rounded-2xl bg-red-500 hover:bg-red-600 active:scale-[0.99] py-4 font-bold text-white shadow-md disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
                ยืนยันการบริจาค
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