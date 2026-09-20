import UserLayout from "@/components/layout/UserLayout";
import DonationForm from "@/components/form/User/DonationForm";

export default function DonorFormPage(){

    return (
        <UserLayout
            homeHref="/user/donor-home"
            backHref="/select-role"
            logoutHref="/user/users-login"
            showHome = {false}
        >
            <DonationForm />
        </UserLayout>
    );
}