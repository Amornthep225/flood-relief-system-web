"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import DonorFormHeader from "@/components/user/DonorForm/DonorFormHeader";
import DonorCategorySelector from "@/components/user/DonorForm/DonorCategorySelector";
import DonorItemSelector from "@/components/user/DonorForm/DonorItemSelector";
import ConfirmDonorModal from "@/components/user/DonorForm/ConfirmDonorModal";
import DonorCenterSelector
    from "@/components/user/DonorForm/DonorCenterSelector";
import { getActiveReliefCategories, getActiveReliefItems } from "@/services/user/sos";
import { createDonation } from "@/services/user/donation";
import DonorImageUpload
    from "@/components/user/DonorForm/DonorImageUpload";
import {
    uploadImage
}
    from "@/services/user/upload";
export default function DonationForm() {
    const router = useRouter();

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCenter, setSelectedCenter] =
        useState(null);
    const [image, setImage] = useState(null);
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
        return items.filter(item => item.reliefCategoryId === selectedCategory);
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
        // 1. Validation Checks
        if (!selectedCenter) {
            await Swal.fire({
                icon: "warning",
                title: "กรุณาเลือกศูนย์รับบริจาค",
                text: "โปรดเลือกจุดรับบริจาคส่วนกลางที่ต้องการส่งมอบสิ่งของ",
                confirmButtonColor: "#3b82f6",
            });
            return;
        }

        if (!selectedItems || selectedItems.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "กรุณาเลือกรายการสิ่งของ",
                text: "อย่างน้อย 1 รายการเพื่อทำการบริจาค",
                confirmButtonColor: "#3b82f6",
            });
            return;
        }

        try {
            setIsSubmitting(true);

            // 2. Upload Image (if exists)
            let imageUrl = null;
            if (image) {
                const uploadResult = await uploadImage(image);

                // Safety Check: ตรวจสอบว่าได้ URL กลับมาจริงหรือไม่
                if (!uploadResult?.imageUrl) {
                    throw new Error("การอัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
                }

                imageUrl = uploadResult.imageUrl;
            }

            // 3. Prepare Payload & Call API
            const payload = {
                centerId: selectedCenter,
                imageUrl,
                items: selectedItems,
            };

            console.log("Donation Payload:", payload);

            const result = await createDonation(payload);
            console.log("Donation Response:", result);

            if (!result?.donationId) {
                throw new Error("ไม่พบรหัสการบริจาคจากระบบ");
            }

            // 4. Success Alert & Redirect
            await Swal.fire({
                icon: "success",
                title: "บันทึกการบริจาคสำเร็จ!",
                text: "กำลังไปยังหน้าติดตามการบริจาค",
                confirmButtonColor: "#3b82f6",
                timer: 1500,
                showConfirmButton: true,
            });

            router.push(`/user/donor-tracking?id=${result.donationId}`);
        } catch (error) {
            console.error("Submit donation error:", error);

            await Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: error?.message || "ไม่สามารถส่งข้อมูลการบริจาคได้",
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