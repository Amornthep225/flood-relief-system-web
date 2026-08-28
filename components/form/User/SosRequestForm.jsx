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
import UserRemark from "@/components/user/SosForm/UserRemark";
import { useLanguage } from "@/contexts/LanguageContext";
const initialLocation = {
    latitude: null,
    longitude: null,
    addressDetail: "",
};

export default function SosRequestForm() {
    const router = useRouter();
    const { t } = useLanguage();

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);

    const [
        selectedCategoryIds,
        setSelectedCategoryIds,
    ] = useState([]);

    const [selectedItemIds, setSelectedItemIds] =
        useState([]);

    const [quantities, setQuantities] = useState({});

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
                    title: t("sos.relief.loadErrorTitle"),
                    text:
                        error.message ||
                        t("sos.relief.loadErrorText"),
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
                title: t("sos.relief.chooseItemTitle"),
                text: t("sos.relief.chooseItemText"),
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
                title: t("sos.relief.pinLocationTitle"),
                text: t("sos.relief.pinLocationText"),
            });

            return false;
        }

        if (!location.addressDetail.trim()) {
            await Swal.fire({
                icon: "warning",
                title: t("sos.relief.addressTitle"),
                text: t("sos.relief.addressText"),
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

                icon: "success",

                title: t("sos.relief.successTitle"),

                text:
                    t("sos.relief.requestId", { id: response.sosRequestId }),

                timer: 1500,

                showConfirmButton: false,

                allowOutsideClick: false

            });



            router.push(
                `/user/sos-success?id=${response.sosRequestId}`
            );



        } catch (error) {


            if (
                error.message.includes("Token") ||
                error.message.includes("เข้าสู่ระบบใหม่")
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");


                await Swal.fire({

                    icon: "warning",

                    title: t("sos.relief.sessionExpired"),

                    text: error.message

                });


                router.replace(
                    "/user/users-login"
                );


                return;

            }



            await Swal.fire({

                icon: "error",

                title: t("sos.relief.submitFailed"),

                text:
                    error.message ||
                    t("sos.relief.genericError")

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
                    {t("sos.relief.loadingItems")}
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
                        {t("sos.relief.title")}
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        {t("sos.relief.subtitle")}
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
                            title={t("sos.relief.categoryTitle")}
                            description={t("sos.relief.categoryDescription")}
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
                                    title={t("sos.relief.itemTitle")}
                                    description={t("sos.relief.itemDescription")}
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
                            title={t("sos.relief.locationTitle")}
                            description={t("sos.relief.locationDescription")}
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
                            title={t("sos.relief.remarkTitle")}
                            description={t("sos.relief.remarkDescription")}
                        />

                        <UserRemark
                            value={userRemark}
                            onChange={setUserRemark}
                        />
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

                        {t("sos.relief.submit")}
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