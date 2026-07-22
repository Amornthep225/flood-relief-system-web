import UserLayout from "@/components/layout/UserLayout";
import DonationHistory from "@/components/user/DonorHistoryPage/DonationHistory";

export default function DonationHistoryPage() {
    return (
        <UserLayout
            homeHref="/user/donor-home"
            backHref="/user/donor-home"
            logoutHref="/user/users-login"
        >
            <DonationHistory />
        </UserLayout>
    );
}