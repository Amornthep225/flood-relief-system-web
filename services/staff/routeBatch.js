"use client";

const PREFIX = "flood-relief-route-batch";

function key(mainRequestId, staffId) {
    return `${PREFIX}:${staffId || "unknown"}:${mainRequestId}`;
}

export function getRouteBatchIds(
    mainRequestId,
    staffId
) {
    if (
        typeof window === "undefined" ||
        !mainRequestId
    ) {
        return [];
    }

    try {
        const raw = localStorage.getItem(
            key(mainRequestId, staffId)
        );

        const value = raw
            ? JSON.parse(raw)
            : [];

        return Array.isArray(value)
            ? [...new Set(
                  value
                      .map(String)
                      .filter(Boolean)
              )]
            : [];
    } catch {
        return [];
    }
}

export function saveRouteBatchIds(
    mainRequestId,
    staffId,
    requestIds
) {
    if (
        typeof window === "undefined" ||
        !mainRequestId
    ) {
        return;
    }

    const cleanIds = [
        ...new Set(
            (Array.isArray(requestIds)
                ? requestIds
                : []
            )
                .map(String)
                .filter(
                    (id) =>
                        id &&
                        id !==
                            String(
                                mainRequestId
                            )
                )
        ),
    ];

    localStorage.setItem(
        key(mainRequestId, staffId),
        JSON.stringify(cleanIds)
    );
}

export function clearRouteBatch(
    mainRequestId,
    staffId
) {
    if (
        typeof window === "undefined" ||
        !mainRequestId
    ) {
        return;
    }

    localStorage.removeItem(
        key(mainRequestId, staffId)
    );
}
