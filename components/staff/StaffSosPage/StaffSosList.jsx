import EmptyState from "./EmptyState";
import StaffSosCard from "./StaffSosCard";

export default function StaffSosList({
    requests,
    activeTab,
    onAccept,
    onOpenGps,
    onOpenDetail,
}) {
    if (!Array.isArray(requests) || requests.length === 0) {
        return <EmptyState activeTab={activeTab} />;
    }

    return (
        <div className="space-y-4">
            {requests.map((request) => (
                <StaffSosCard
                    key={request.id}
                    request={request}
                    onAccept={onAccept}
                    onOpenGps={onOpenGps}
                    onOpenDetail={onOpenDetail}
                />
            ))}
        </div>
    );
}