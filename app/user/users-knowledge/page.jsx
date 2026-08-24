import UserLayout from "@/components/layout/UserLayout";
import FloodKnowledgeCenter from "@/components/user/KnowledgeCenter/FloodKnowledgeCenter";

export default function UserKnowledgePage() {
    return (
        <UserLayout
            homeHref= "/user/sos-home"
            backHref="/user/sos-home"
            logoutHref="/user/users-login"
            showHome = {false}
            >
          
            <FloodKnowledgeCenter />
        </UserLayout>
    );
}