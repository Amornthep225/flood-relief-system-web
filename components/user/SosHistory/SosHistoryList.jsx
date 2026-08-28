"use client";

import SosHistoryCard from "./SosHistoryCard";
import SosHistoryState from "./SosHistoryState";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SosHistoryList({ requests, selectedFilter }) {
    const { t } = useLanguage();

    if (!Array.isArray(requests)) {
        return null;
    }

    if (requests.length === 0) {
        return (
            <SosHistoryState
                icon="history"
                title={getEmptyTitle(selectedFilter, t)}
                description={getEmptyDescription(selectedFilter, t)}
            />
        );
    }

    return (
        <div className="space-y-5">
            {requests.map((request) => (
                <SosHistoryCard key={request.id} request={request} />
            ))}
        </div>
    );
}

function getEmptyTitle(filter, t) {
    if (filter === "active") {
        return t("sos.history.empty.activeTitle");
    }

    if (filter === "completed") {
        return t("sos.history.empty.completedTitle");
    }

    if (filter === "cancelled") {
        return t("sos.history.empty.cancelledTitle");
    }

    return t("sos.history.empty.allTitle");
}

function getEmptyDescription(filter, t) {
    if (filter === "all") {
        return t("sos.history.empty.allDescription");
    }

    return t("sos.history.empty.filteredDescription");
}
