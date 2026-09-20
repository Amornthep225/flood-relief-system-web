import UserLayout from "@/components/layout/UserLayout";
import SosRequestForm from "@/components/form/User/SosRequestForm";

export default function RequestHelpFormPage() {
    return (
        <UserLayout
            homeHref="/user/sos-home"
            backHref="/select-role"
            logoutHref="/user/users-login"
            showHome = {false}
        >
            <SosRequestForm />
        </UserLayout>
    );
}