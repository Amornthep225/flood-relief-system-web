

import DonorHero from "@/components/user/DonorHome/DonorHero";
import DonorMenu from "@/components/user/DonorHome/DonorMenu";
import UserLayout from "@/components/layout/UserLayout";

export default function DonorHomePage() {
    return (
        <UserLayout
            homeHref="/user/donor-home"
            backHref="/select-role"
            logoutHref="/user/users-login"
        >
                

                <main className="max-w-7xl mx-auto px-6 py-8">
                    <DonorHero />
                    <DonorMenu />
                </main>
        </UserLayout>
    );
}