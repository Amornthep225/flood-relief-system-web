function extractRequests(response) {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.requests)) {
        return response.requests;
    }

    return [];
}

export function getPendingCaseCount(response) {
    return extractRequests(response).filter(
        (request) =>
            String(request?.status || "")
                .trim()
                .toLowerCase() === "pending"
    ).length;
}

export function formatPendingCaseBadge(count) {
    const normalizedCount = Math.max(
        0,
        Number(count) || 0
    );

    return normalizedCount > 99
        ? "99+"
        : String(normalizedCount);
}
