import UserLayout from "@/components/layout/UserLayout";
import EmergencySosForm from "@/components/form/User/EmergencySosForm";

export default function EmergencySosFormPage() {
    return (
        <UserLayout
            homeHref="/select-role"
            backHref="/select-role"
            logoutHref="/user/users-login"
            showHome={false}
        >
            <EmergencySosForm />
        </UserLayout>
    );
}
