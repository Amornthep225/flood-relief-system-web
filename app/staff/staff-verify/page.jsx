import StaffLayout from "@/components/layout/StaffLayout";
import StaffDonationVerify from "@/components/staff/StaffDonationVerifyPage/StaffDonationVerify";

export default function StaffVerifyPage() {
    return (
        <StaffLayout
            backHref="/staff/staff-home"
            showHome = {false}
        >
            <StaffDonationVerify />
        </StaffLayout>
    );
}