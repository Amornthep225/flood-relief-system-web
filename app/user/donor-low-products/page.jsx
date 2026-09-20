import UserLayout from "@/components/layout/UserLayout";
import LowProducts from "@/components/user/DonorLowProductsPage/LowProducts";

export default function LowProductsPage() {
    return (
        <UserLayout
            homeHref="/user/donor-home"
            backHref="/select-role"
            logoutHref="/user/users-login"
            showHome = {false}
        >
            <LowProducts />
        </UserLayout>
    );
}