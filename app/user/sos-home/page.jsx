import UserLayout from "@/components/layout/UserLayout";
import UserHomeMenu from "@/components/user/UserHome/UserHomeMenu";
import UserHero from "@/components/user/UserHome/UserHero";

export default function UserHomePage() {
    return (
        <UserLayout
            homeHref="/user/sos-home"
            backHref="/select-role"
            logoutHref="/user/users-login"
        >
            <div className="space-y-8">
                <UserHero />
                <UserHomeMenu />
            </div>
        </UserLayout>
    );
}