import EmptyState from "./EmptyState";
import StaffSosTable from "./StaffSosTable";

export default function StaffSosList({
    requests,
    requestType,
    activeTab,
    onAccept,
    onOpenGps,
    onOpenDetail,
}) {
    if (!Array.isArray(requests) || requests.length === 0) {
        return <EmptyState activeTab={activeTab} />;
    }

    return (
        <StaffSosTable
            requests={requests}
            requestType={requestType}
            onAccept={onAccept}
            onOpenGps={onOpenGps}
            onOpenDetail={onOpenDetail}
        />
    );
}
