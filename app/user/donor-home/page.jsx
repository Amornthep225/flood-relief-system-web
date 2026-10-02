

import DonorHero from "@/components/user/DonorHome/DonorHero";
import DonorMenu from "@/components/user/DonorHome/DonorMenu";
import UserLayout from "@/components/layout/UserLayout";

export default function DonorHomePage() {
    return (
        <UserLayout
            homeHref="/user/donor-home"
            backHref="/select-role"
            logoutHref="/user/users-login"
            showHome = {false}
        >
                

                <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
                    <DonorHero />
                    <DonorMenu />
                </main>
        </UserLayout>
    );
}