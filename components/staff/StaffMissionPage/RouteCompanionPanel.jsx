"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import Swal from "sweetalert2";

import { useNativeUi } from "@/hooks/useNativeUi";
import {
    acceptSosRequest,
    getStaffSosRequests,
} from "@/services/staff/sos";
import { getCenterInventory } from "@/services/staff/inventory";
import { getStaffCenter } from "@/services/staff/center";
import {
    getRouteBatchIds,
    saveRouteBatchIds,
} from "@/services/staff/routeBatch";

const MAX_EXTRA_STOPS = 5;

// A candidate must genuinely sit near the center -> main-case corridor.
// The corridor scales with route length, but stays forgiving enough for real roads
// that do not follow a perfect straight line.
const MIN_ROUTE_CORRIDOR_KM = 5;
const MAX_ROUTE_CORRIDOR_KM = 12;
const ROUTE_CORRIDOR_RATIO = 0.4;
const ROUTE_PROGRESS_MARGIN = 0.05;
const MIN_ALLOWED_DETOUR_KM = 8;
const MAX_ALLOWED_DETOUR_KM = 20;
const DETOUR_RATIO = 0.65;

export default function RouteCompanionPanel({
    mainRequest,
}) {
    const { ui, language } = useNativeUi();

    const tx = (th, en) =>
        language === "en" ? en : th;

    const [loading, setLoading] =
        useState(true);
    const [accepting, setAccepting] =
        useState(false);
    const [error, setError] =
        useState("");

    const [center, setCenter] =
        useState(null);
    const [allRequests, setAllRequests] =
        useState([]);
    const [inventories, setInventories] =
        useState([]);
    const [selectedIds, setSelectedIds] =
        useState([]);
    const [batchIds, setBatchIds] =
        useState([]);

    const staffInfo = useMemo(
        () => readStaffInfo(),
        []
    );

    const mainStatus = String(
        mainRequest?.status || ""
    )
        .trim()
        .toLowerCase();

    const canAddStops = [
        "accepted",
        "preparing",
    ].includes(mainStatus);

    const loadData = useCallback(async () => {
        if (
            !mainRequest?.id ||
            !staffInfo?.centerId
        ) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const [
                centerResponse,
                requestsResponse,
                inventoryResponse,
            ] = await Promise.all([
                getStaffCenter(
                    staffInfo.centerId
                ),
                getStaffSosRequests(),
                getCenterInventory(
                    staffInfo.centerId
                ),
            ]);

            setCenter(
                centerResponse?.data ??
                    centerResponse
            );

            setAllRequests(
                normalizeList(
                    requestsResponse
                )
            );

            setInventories(
                normalizeList(
                    inventoryResponse
                )
            );

            setBatchIds(
                getRouteBatchIds(
                    mainRequest.id,
                    staffInfo.id
                )
            );
        } catch (loadError) {
            setError(
                ui(
                    loadError?.message ||
                        "ไม่สามารถค้นหาเคสระหว่างทางได้"
                )
            );
        } finally {
            setLoading(false);
        }
    }, [
        mainRequest?.id,
        staffInfo?.centerId,
        staffInfo?.id,
        ui,
    ]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const routeInfo = useMemo(() => {
        const start = getCoordinate(center);
        const end =
            getCoordinate(mainRequest);

        if (!start || !end) {
            return null;
        }

        const routeLengthKm =
            haversineKm(start, end);

        if (
            !Number.isFinite(
                routeLengthKm
            ) ||
            routeLengthKm < 0.05
        ) {
            return null;
        }

        return {
            start,
            end,
            routeLengthKm,
        };
    }, [center, mainRequest]);

    const batchCases = useMemo(() => {
        const idSet = new Set(
            batchIds.map(String)
        );

        return allRequests
            .filter((request) =>
                idSet.has(
                    String(request.id)
                )
            )
            .map((request) => {
                const routeMetric =
                    routeInfo
                        ? pointToRouteMetric(
                              routeInfo.start,
                              routeInfo.end,
                              getCoordinate(
                                  request
                              )
                          )
                        : null;

                return {
                    ...request,
                    routeProgress:
                        routeMetric
                            ?.progress ?? 0,
                    distanceToRouteKm:
                        routeMetric
                            ?.distanceKm ??
                        null,
                };
            })
            .sort(
                (a, b) =>
                    a.routeProgress -
                    b.routeProgress
            );
    }, [
        allRequests,
        batchIds,
        routeInfo,
    ]);

    const candidates = useMemo(() => {
        if (!routeInfo) {
            return [];
        }

        const batchSet = new Set(
            batchIds.map(String)
        );

        const corridorKm =
            getRouteCorridorKm(
                routeInfo.routeLengthKm
            );

        const maxDetourKm =
            getMaxRouteDetourKm(
                routeInfo.routeLengthKm
            );

        return allRequests
            .filter((request) => {
                if (
                    !request?.id ||
                    String(request.id) ===
                        String(
                            mainRequest?.id
                        )
                ) {
                    return false;
                }

                if (
                    batchSet.has(
                        String(request.id)
                    )
                ) {
                    return false;
                }

                if (
                    String(
                        request.status || ""
                    )
                        .trim()
                        .toLowerCase() !==
                    "pending"
                ) {
                    return false;
                }

                if (
                    String(
                        request.requestType ||
                            "Relief"
                    )
                        .trim()
                        .toLowerCase() ===
                    "emergency"
                ) {
                    return false;
                }

                return Boolean(
                    getCoordinate(request)
                );
            })
            .map((request) => {
                const coordinate =
                    getCoordinate(request);

                const metric =
                    pointToRouteMetric(
                        routeInfo.start,
                        routeInfo.end,
                        coordinate
                    );

                const detourKm = Math.max(
                    0,
                    haversineKm(
                        routeInfo.start,
                        coordinate
                    ) +
                        haversineKm(
                            coordinate,
                            routeInfo.end
                        ) -
                        routeInfo.routeLengthKm
                );

                const isAlongRoute =
                    metric.progress >=
                        -ROUTE_PROGRESS_MARGIN &&
                    metric.progress <=
                        1 + ROUTE_PROGRESS_MARGIN &&
                    metric.distanceKm <=
                        corridorKm &&
                    detourKm <=
                        maxDetourKm;

                return {
                    ...request,
                    routeProgress:
                        metric.progress,
                    distanceToRouteKm:
                        metric.distanceKm,
                    routeDetourKm:
                        detourKm,
                    routeCorridorKm:
                        corridorKm,
                    isAlongRoute,
                };
            })
            .filter(
                (request) =>
                    request.isAlongRoute
            )
            .sort((a, b) => {
                if (
                    a.routeProgress !==
                    b.routeProgress
                ) {
                    return (
                        a.routeProgress -
                        b.routeProgress
                    );
                }

                return (
                    a.routeDetourKm -
                    b.routeDetourKm
                );
            });
    }, [
        allRequests,
        batchIds,
        mainRequest?.id,
        routeInfo,
    ]);

    const selectedCases = useMemo(() => {
        const selected = new Set(
            selectedIds.map(String)
        );

        return candidates.filter(
            (request) =>
                selected.has(
                    String(request.id)
                )
        );
    }, [candidates, selectedIds]);

    const preparationCases = useMemo(
        () => [
            mainRequest,
            ...batchCases,
            ...selectedCases,
        ].filter(Boolean),
        [
            mainRequest,
            batchCases,
            selectedCases,
        ]
    );

    const preparationItems = useMemo(
        () =>
            aggregateRequestedItems(
                preparationCases,
                inventories
            ),
        [
            preparationCases,
            inventories,
        ]
    );

    const isStockEnough =
        preparationItems.length > 0 &&
        preparationItems.every(
            (item) => item.isEnough
        );

    const routeStops = useMemo(
        () =>
            [
                ...batchCases,
                ...selectedCases,
            ]
                .filter((item) =>
                    getCoordinate(item)
                )
                .sort(
                    (a, b) =>
                        a.routeProgress -
                        b.routeProgress
                ),
        [
            batchCases,
            selectedCases,
        ]
    );

    const mapsUrl = useMemo(() => {
        if (!routeInfo) {
            return null;
        }

        const waypoints = routeStops
            .slice(0, MAX_EXTRA_STOPS)
            .map(getCoordinate)
            .filter(Boolean);

        return buildGoogleMapsRouteUrl(
            routeInfo.start,
            routeInfo.end,
            waypoints
        );
    }, [routeInfo, routeStops]);

    const toggleCandidate = (id) => {
        if (!canAddStops) {
            return;
        }

        setSelectedIds((current) => {
            const stringId =
                String(id);

            if (
                current.includes(
                    stringId
                )
            ) {
                return current.filter(
                    (item) =>
                        item !==
                        stringId
                );
            }

            if (
                current.length +
                    batchIds.length >=
                MAX_EXTRA_STOPS
            ) {
                return current;
            }

            return [
                ...current,
                stringId,
            ];
        });
    };

    const handleAddToRoute = async () => {
        if (
            !selectedCases.length ||
            !isStockEnough
        ) {
            return;
        }

        const result =
            await Swal.fire({
                icon: "question",
                title: tx(
                    "เพิ่มเคสเข้ารอบส่งเดียวกัน?",
                    "Add cases to this delivery route?"
                ),
                html:
                    language === "en"
                        ? `The selected ${selectedCases.length} case(s) will be assigned to you and prepared together with case <b>#${mainRequest.id}</b>.`
                        : `เคสที่เลือก ${selectedCases.length} เคสจะถูกมอบหมายให้คุณ และเตรียมของรวมกับเคส <b>#${mainRequest.id}</b>`,
                showCancelButton: true,
                confirmButtonText:
                    tx(
                        "ยืนยันเพิ่มเข้ารอบ",
                        "Add to Route"
                    ),
                cancelButtonText:
                    tx(
                        "ยกเลิก",
                        "Cancel"
                    ),
                reverseButtons: true,
            });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setAccepting(true);

            const acceptedIds = [];

            for (
                const candidate
                of selectedCases
            ) {
                await acceptSosRequest(
                    candidate.id,
                    {
                        staffRemark:
                            `Route batch with ${mainRequest.id}`,
                    }
                );

                acceptedIds.push(
                    String(
                        candidate.id
                    )
                );
            }

            const nextBatchIds = [
                ...new Set([
                    ...batchIds,
                    ...acceptedIds,
                ]),
            ];

            saveRouteBatchIds(
                mainRequest.id,
                staffInfo.id,
                nextBatchIds
            );

            setBatchIds(
                nextBatchIds
            );
            setSelectedIds([]);

            await loadData();

            await Swal.fire({
                icon: "success",
                title: tx(
                    "เพิ่มเคสเข้ารอบส่งแล้ว",
                    "Cases Added to Delivery Route"
                ),
                text: tx(
                    "ระบบมอบหมายเคสให้คุณและรวมรายการสิ่งของสำหรับเตรียมส่งในรอบเดียวกันแล้ว",
                    "The cases are assigned to you and their supplies are now grouped for the same delivery trip."
                ),
                confirmButtonText:
                    tx("ตกลง", "OK"),
            });
        } catch (acceptError) {
            await loadData();

            await Swal.fire({
                icon: "error",
                title: tx(
                    "เพิ่มเคสเข้ารอบไม่สำเร็จ",
                    "Could Not Add Cases"
                ),
                text: ui(
                    acceptError?.message ||
                        "บางเคสอาจถูกเจ้าหน้าที่คนอื่นรับไปแล้ว กรุณาโหลดข้อมูลใหม่"
                ),
                confirmButtonText:
                    tx("ตกลง", "OK"),
            });
        } finally {
            setAccepting(false);
        }
    };

    if (
        String(
            mainRequest?.requestType ||
                "Relief"
        )
            .trim()
            .toLowerCase() ===
        "emergency"
    ) {
        return null;
    }

    if (
        ![
            "accepted",
            "preparing",
            "delivering",
        ].includes(mainStatus)
    ) {
        return null;
    }

    return (
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sky-600">
                                route
                            </span>
                            <h2 className="text-lg font-black text-slate-900">
                                {tx(
                                    "เคสที่อยู่ระหว่างทาง",
                                    "Cases Along This Route"
                                )}
                            </h2>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            {tx(
                                "ระบบกรองคำขอที่อยู่ใกล้แนวเส้นทางจากศูนย์ไปยังเคสหลัก เพื่อให้เลือกนำส่งพร้อมกัน",
                                "The system filters pending relief requests near the center-to-main-case route so they can be delivered in the same trip."
                            )}
                        </p>
                    </div>

                    {routeInfo && (
                        <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                            {tx(
                                "เส้นทางหลัก",
                                "Main route"
                            )}{" "}
                            {routeInfo.routeLengthKm.toFixed(
                                1
                            )}{" "}
                            km
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-6 p-6">
                {loading ? (
                    <div className="flex min-h-[180px] items-center justify-center gap-3 text-slate-500">
                        <span className="material-symbols-outlined animate-spin">
                            progress_activity
                        </span>
                        <span className="font-bold">
                            {tx(
                                "กำลังค้นหาเคสระหว่างทาง...",
                                "Searching for cases along the route..."
                            )}
                        </span>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-bold text-amber-700">
                        {error}
                    </div>
                ) : (
                    <>
                        <RouteDeliveryInfographic
                            routeInfo={routeInfo}
                            mainRequest={mainRequest}
                            acceptedRouteCases={batchCases}
                            selectedRouteCases={selectedCases}
                            candidateCount={candidates.length}
                            tripCount={
                                1 +
                                batchCases.length +
                                selectedCases.length
                            }
                            remainingStops={Math.max(
                                0,
                                MAX_EXTRA_STOPS -
                                    batchIds.length -
                                    selectedIds.length
                            )}
                            stockReady={isStockEnough}
                            shortageCount={
                                preparationItems.filter(
                                    (item) =>
                                        !item.isEnough
                                ).length
                            }
                            tx={tx}
                        />

                        {batchCases.length >
                            0 && (
                            <CurrentRouteBatch
                                cases={
                                    batchCases
                                }
                                ui={ui}
                                tx={tx}
                            />
                        )}

                        {canAddStops ? (
                            <div>
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <h3 className="font-black text-slate-800">
                                        {tx(
                                            "เคสแนะนำ",
                                            "Suggested Cases"
                                        )}
                                    </h3>

                                    <span className="text-xs font-bold text-slate-400">
                                        {
                                            candidates.length
                                        }{" "}
                                        {tx(
                                            "เคส",
                                            "cases"
                                        )}
                                    </span>
                                </div>

                                {candidates.length ===
                                0 ? (
                                    <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                                        {routeInfo
                                            ? tx(
                                                  "ขณะนี้ไม่พบคำขออื่นที่อยู่ในแนวเส้นทางเดียวกัน",
                                                  "There are currently no other pending relief requests along this route."
                                              )
                                            : tx(
                                                  "ไม่สามารถคำนวณแนวเส้นทางได้ กรุณาตรวจสอบพิกัดศูนย์และเคสหลัก",
                                                  "The route cannot be calculated. Please check the center and main-case coordinates."
                                              )}
                                    </div>
                                ) : (
                                    <div className="grid gap-3 lg:grid-cols-2">
                                        {candidates.map(
                                            (
                                                candidate
                                            ) => (
                                                <CandidateCard
                                                    key={
                                                        candidate.id
                                                    }
                                                    candidate={
                                                        candidate
                                                    }
                                                    selected={selectedIds.includes(
                                                        String(
                                                            candidate.id
                                                        )
                                                    )}
                                                    disabled={
                                                        !selectedIds.includes(
                                                            String(
                                                                candidate.id
                                                            )
                                                        ) &&
                                                        selectedIds.length +
                                                            batchIds.length >=
                                                            MAX_EXTRA_STOPS
                                                    }
                                                    onToggle={() =>
                                                        toggleCandidate(
                                                            candidate.id
                                                        )
                                                    }
                                                    ui={
                                                        ui
                                                    }
                                                    tx={
                                                        tx
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-xl bg-blue-50 p-4 text-sm font-bold text-blue-700">
                                {tx(
                                    "ภารกิจเริ่มนำส่งแล้ว จึงไม่สามารถเพิ่มจุดส่งใหม่ในรอบนี้ได้",
                                    "Delivery has already started, so new stops can no longer be added to this route."
                                )}
                            </div>
                        )}

                        {(batchCases.length >
                            0 ||
                            selectedCases.length >
                                0) && (
                            <PreparationSummary
                                items={
                                    preparationItems
                                }
                                caseCount={
                                    preparationCases.length
                                }
                                ui={ui}
                                tx={tx}
                            />
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row">
                            {mapsUrl && (
                                <a
                                    href={
                                        mapsUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white py-3 font-bold text-sky-700 transition hover:bg-sky-50"
                                >
                                    <span className="material-symbols-outlined">
                                        near_me
                                    </span>
                                    {tx(
                                        "ดูเส้นทางรวมใน Google Maps",
                                        "Open Combined Route in Google Maps"
                                    )}
                                </a>
                            )}

                            {canAddStops &&
                                selectedCases.length >
                                    0 && (
                                <button
                                    type="button"
                                    onClick={
                                        handleAddToRoute
                                    }
                                    disabled={
                                        accepting ||
                                        !isStockEnough
                                    }
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                >
                                    <span
                                        className={`material-symbols-outlined ${
                                            accepting
                                                ? "animate-spin"
                                                : ""
                                        }`}
                                    >
                                        {accepting
                                            ? "progress_activity"
                                            : "add_road"}
                                    </span>
                                    {accepting
                                        ? tx(
                                              "กำลังเพิ่มเข้ารอบ...",
                                              "Adding..."
                                          )
                                        : isStockEnough
                                          ? tx(
                                                `เพิ่ม ${selectedCases.length} เคสเข้ารอบส่ง`,
                                                `Add ${selectedCases.length} Case(s) to Route`
                                            )
                                          : tx(
                                                "ของรวมไม่เพียงพอ",
                                                "Combined Stock Insufficient"
                                            )}
                                </button>
                            )}
                        </div>

                        {selectedCases.length >
                            0 &&
                            !isStockEnough && (
                            <p className="text-center text-xs font-bold text-red-600">
                                {tx(
                                    "ไม่สามารถเพิ่มเคสที่เลือกได้ เพราะสิ่งของรวมของรอบส่งนี้ไม่เพียงพอ",
                                    "The selected cases cannot be added because combined inventory is insufficient."
                                )}
                            </p>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}



function RouteDeliveryInfographic({
    routeInfo,
    mainRequest,
    acceptedRouteCases,
    selectedRouteCases,
    candidateCount,
    tripCount,
    remainingStops,
    stockReady,
    shortageCount,
    tx,
}) {
    const routeDistance =
        routeInfo?.routeLengthKm;

    const realStops = [
        ...(Array.isArray(
            acceptedRouteCases
        )
            ? acceptedRouteCases.map(
                  (request) => ({
                      ...request,
                      routeState:
                          "accepted",
                  })
              )
            : []),
        ...(Array.isArray(
            selectedRouteCases
        )
            ? selectedRouteCases.map(
                  (request) => ({
                      ...request,
                      routeState:
                          "selected",
                  })
              )
            : []),
    ];

    const uniqueStops = Array.from(
        new Map(
            realStops.map((request) => [
                String(request.id),
                request,
            ])
        ).values()
    );

    const routeSteps = [
        {
            key: "center",
            icon: "warehouse",
            title: tx(
                "ศูนย์",
                "Center"
            ),
            subtitle: tx(
                "จุดเริ่มต้น",
                "Start"
            ),
            state: "done",
        },
        {
            key: `main-${mainRequest?.id || "main"}`,
            icon: "flag",
            title: tx(
                "เคสหลัก",
                "Main Case"
            ),
            subtitle:
                mainRequest?.id
                    ? `#${mainRequest.id}`
                    : tx(
                          "ภารกิจหลัก",
                          "Primary mission"
                      ),
            state: "active",
        },
        ...uniqueStops.map(
            (request, index) => ({
                key: `extra-${request.id}`,
                icon: "location_on",
                title: tx(
                    `จุดส่งเพิ่ม ${index + 1}`,
                    `Extra Stop ${index + 1}`
                ),
                subtitle: `#${request.id}`,
                state:
                    request.routeState ===
                    "accepted"
                        ? "done"
                        : "selected",
            })
        ),
        {
            key: "destination",
            icon: "home",
            title: tx(
                "ปลายทาง",
                "Destination"
            ),
            subtitle: tx(
                "ผู้ประสบภัย",
                "Requester"
            ),
            state: "waiting",
        },
    ];

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-sky-50 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-100">
                        <span className="material-symbols-outlined text-[26px]">
                            route
                        </span>
                    </div>

                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sky-500">
                            {tx(
                                "แผนรอบส่ง",
                                "DELIVERY PLAN"
                            )}
                        </p>

                        <h3 className="mt-0.5 text-lg font-black text-slate-900">
                            {tx(
                                "เส้นทางช่วยเหลือรอบนี้",
                                "Current Relief Delivery Route"
                            )}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            {uniqueStops.length > 0
                                ? tx(
                                      `มีจุดส่งเพิ่มจริง ${uniqueStops.length} เคสในรอบนี้`,
                                      `${uniqueStops.length} real extra stop(s) are included in this trip.`
                                  )
                                : tx(
                                      "ยังไม่มีเคสอื่นเพิ่มเข้ารอบส่ง",
                                      "No additional cases have been added to this trip yet."
                                  )}
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-right shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                        {tx(
                            "เส้นทางหลัก",
                            "MAIN ROUTE"
                        )}
                    </p>
                    <p className="mt-0.5 text-lg font-black text-sky-700">
                        {Number.isFinite(
                            routeDistance
                        )
                            ? `${routeDistance.toFixed(
                                  1
                              )} km`
                            : "-"}
                    </p>
                </div>
            </div>

            <div className="p-5 md:p-6">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-[#f8fbff] to-white px-4 py-6 md:px-7 md:py-7">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-sky-100/60 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-indigo-100/50 blur-3xl" />

                    <div className="relative">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black text-slate-800">
                                    {tx(
                                        "ลำดับการเดินทางจริง",
                                        "Actual route sequence"
                                    )}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    {tx(
                                        "จะแสดงเฉพาะเคสที่อยู่ในรอบส่งจริงเท่านั้น",
                                        "Only cases actually included in this trip are shown."
                                    )}
                                </p>
                            </div>

                            <div
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${
                                    stockReady
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-amber-50 text-amber-700"
                                }`}
                            >
                                <span className="material-symbols-outlined text-base">
                                    {stockReady
                                        ? "verified"
                                        : "warning"}
                                </span>

                                {stockReady
                                    ? tx(
                                          "พร้อมจัดส่ง",
                                          "Ready to deliver"
                                      )
                                    : shortageCount >
                                        0
                                      ? tx(
                                            `ของขาด ${shortageCount} รายการ`,
                                            `${shortageCount} item(s) short`
                                        )
                                      : tx(
                                            "รอตรวจสต๊อก",
                                            "Checking stock"
                                        )}
                            </div>
                        </div>

                        <div className="overflow-x-auto pb-2">
                            <div
                                className="relative mx-auto min-w-[560px]"
                                style={{
                                    width: `${Math.max(
                                        100,
                                        routeSteps.length *
                                            150
                                    )}px`,
                                }}
                            >
                                <div className="absolute left-[75px] right-[75px] top-[26px] h-[4px] rounded-full bg-slate-200" />

                                <div
                                    className="absolute left-[75px] top-[26px] h-[4px] rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500"
                                    style={{
                                        width:
                                            routeSteps.length >
                                            2
                                                ? `${Math.max(
                                                      18,
                                                      ((routeSteps.length -
                                                          2) /
                                                          (routeSteps.length -
                                                              1)) *
                                                          100
                                                  )}%`
                                                : "45%",
                                        maxWidth:
                                            "calc(100% - 150px)",
                                    }}
                                />

                                <div
                                    className="relative z-10 grid"
                                    style={{
                                        gridTemplateColumns: `repeat(${routeSteps.length}, minmax(120px, 1fr))`,
                                    }}
                                >
                                    {routeSteps.map(
                                        (
                                            step
                                        ) => (
                                            <DynamicRouteStep
                                                key={
                                                    step.key
                                                }
                                                icon={
                                                    step.icon
                                                }
                                                title={
                                                    step.title
                                                }
                                                subtitle={
                                                    step.subtitle
                                                }
                                                state={
                                                    step.state
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {uniqueStops.length ===
                            0 && (
                            <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-3 text-center">
                                <p className="text-sm font-black text-slate-600">
                                    {tx(
                                        "เมื่อเลือกเคสใกล้เคียงและกดเพิ่มเข้ารอบ จุดส่งใหม่จะปรากฏตรงนี้",
                                        "When you select a nearby case and add it to the trip, the new stop will appear here."
                                    )}
                                </p>
                            </div>
                        )}

                        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <PremiumMetricCard
                                icon="inventory_2"
                                label={tx(
                                    "เคสรอพิจารณา",
                                    "Candidate cases"
                                )}
                                value={
                                    candidateCount
                                }
                                helper={tx(
                                    "ยังไม่ได้หมายความว่ารับเข้ารอบแล้ว",
                                    "These have not been added to the trip yet."
                                )}
                                tone="sky"
                            />

                            <PremiumMetricCard
                                icon="route"
                                label={tx(
                                    "รวมในรอบส่ง",
                                    "Cases in trip"
                                )}
                                value={
                                    tripCount
                                }
                                helper={tx(
                                    "เคสหลัก + เคสที่เพิ่มจริง",
                                    "Main case + cases actually added"
                                )}
                                tone="emerald"
                            />

                            <PremiumMetricCard
                                icon="add_circle"
                                label={tx(
                                    "เพิ่มได้อีก",
                                    "Remaining stops"
                                )}
                                value={
                                    remainingStops
                                }
                                helper={tx(
                                    "สูงสุด 5 จุดเพิ่มต่อรอบ",
                                    "Up to 5 extra stops"
                                )}
                                tone="amber"
                            />

                            <PremiumMetricCard
                                icon={
                                    stockReady
                                        ? "inventory"
                                        : "warning"
                                }
                                label={tx(
                                    "สถานะสต๊อก",
                                    "Stock status"
                                )}
                                value={
                                    stockReady
                                        ? tx(
                                              "พร้อม",
                                              "Ready"
                                          )
                                        : shortageCount >
                                            0
                                          ? tx(
                                                `ขาด ${shortageCount}`,
                                                `${shortageCount} short`
                                            )
                                          : tx(
                                                "รอตรวจ",
                                                "Checking"
                                            )
                                }
                                helper={
                                    stockReady
                                        ? tx(
                                              "ของรวมเพียงพอ",
                                              "Combined stock is sufficient"
                                          )
                                        : tx(
                                              "ตรวจของรวมก่อนเพิ่มเคส",
                                              "Review combined inventory first"
                                          )
                                }
                                tone={
                                    stockReady
                                        ? "violet"
                                        : "rose"
                                }
                                textValue
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function DynamicRouteStep({
    icon,
    title,
    subtitle,
    state,
}) {
    const circleStyle = {
        done:
            "border-sky-500 bg-sky-600 text-white shadow-lg shadow-sky-100",
        active:
            "border-indigo-500 bg-white text-indigo-600 ring-4 ring-indigo-100",
        selected:
            "border-amber-400 bg-amber-50 text-amber-700 ring-4 ring-amber-100",
        waiting:
            "border-slate-200 bg-white text-slate-400",
    };

    const badge =
        state === "selected"
            ? "กำลังเลือก"
            : null;

    return (
        <div className="flex min-w-0 flex-col items-center px-2 text-center">
            <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-[3px] ${
                    circleStyle[state] ||
                    circleStyle.waiting
                }`}
            >
                <span className="material-symbols-outlined text-xl">
                    {icon}
                </span>
            </div>

            <p className="mt-3 max-w-[130px] truncate text-sm font-black text-slate-800">
                {title}
            </p>

            <p className="mt-0.5 max-w-[130px] truncate text-[10px] font-medium text-slate-400">
                {subtitle}
            </p>

            {badge && (
                <span className="mt-1 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black text-amber-700">
                    {badge}
                </span>
            )}
        </div>
    );
}

function PremiumMetricCard({
    icon,
    label,
    value,
    helper,
    tone,
    textValue = false,
}) {
    const tones = {
        sky: {
            box:
                "border-sky-100 bg-sky-50/70",
            icon:
                "bg-sky-100 text-sky-700",
            value:
                "text-sky-800",
        },
        emerald: {
            box:
                "border-emerald-100 bg-emerald-50/70",
            icon:
                "bg-emerald-100 text-emerald-700",
            value:
                "text-emerald-800",
        },
        amber: {
            box:
                "border-amber-100 bg-amber-50/70",
            icon:
                "bg-amber-100 text-amber-700",
            value:
                "text-amber-800",
        },
        violet: {
            box:
                "border-violet-100 bg-violet-50/70",
            icon:
                "bg-violet-100 text-violet-700",
            value:
                "text-violet-800",
        },
        rose: {
            box:
                "border-rose-100 bg-rose-50/70",
            icon:
                "bg-rose-100 text-rose-700",
            value:
                "text-rose-800",
        },
    };

    const current =
        tones[tone] ||
        tones.sky;

    return (
        <div
            className={`rounded-2xl border p-4 ${current.box}`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${current.icon}`}
                >
                    <span className="material-symbols-outlined text-xl">
                        {icon}
                    </span>
                </div>

                <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                        {label}
                    </p>

                    <p
                        className={`mt-1 font-black leading-none ${current.value} ${
                            textValue
                                ? "text-xl"
                                : "text-3xl"
                        }`}
                    >
                        {String(value)}
                    </p>

                    <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">
                        {helper}
                    </p>
                </div>
            </div>
        </div>
    );
}

function CandidateCard({
    candidate,
    selected,
    disabled,
    onToggle,
    ui,
    tx,
}) {
    const items = Array.isArray(
        candidate.items
    )
        ? candidate.items
        : [];

    return (
        <button
            type="button"
            onClick={onToggle}
            disabled={disabled}
            className={`w-full rounded-2xl border p-4 text-left transition ${
                selected
                    ? "border-sky-400 bg-sky-50 ring-2 ring-sky-100"
                    : "border-slate-200 bg-white hover:border-sky-200 hover:bg-slate-50"
            } disabled:cursor-not-allowed disabled:opacity-50`}
        >
            <div className="flex items-start gap-3">
                <span
                    className={`material-symbols-outlined mt-0.5 ${
                        selected
                            ? "text-sky-600"
                            : "text-slate-300"
                    }`}
                >
                    {selected
                        ? "check_box"
                        : "check_box_outline_blank"}
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-black text-slate-800">
                            {tx(
                                "คำขอรับสิ่งของ",
                                "Relief Request"
                            )}{" "}
                            #{candidate.id}
                        </p>

                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">
                            {tx(
                                "อยู่ในแนวเส้นทาง",
                                "Along this route"
                            )}
                        </span>
                    </div>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {candidate.addressDetail ||
                            tx(
                                "ไม่ระบุสถานที่",
                                "Location unavailable"
                            )}
                    </p>

                    {Number.isFinite(
                        candidate.distanceToRouteKm
                    ) && (
                        <p className="mt-1 text-xs font-bold text-slate-400">
                            {tx(
                                "ห่างจากแนวเส้นทางโดยประมาณ",
                                "Approx. distance from route"
                            )}{" "}
                            {candidate.distanceToRouteKm.toFixed(
                                1
                            )}{" "}
                            km
                            {Number.isFinite(
                                candidate.routeDetourKm
                            ) && (
                                <span className="ml-1 font-normal">
                                    {tx(
                                        `• อ้อมเพิ่มประมาณ ${candidate.routeDetourKm.toFixed(1)} km`,
                                        `• approx. ${candidate.routeDetourKm.toFixed(1)} km added detour`
                                    )}
                                </span>
                            )}
                        </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                        {items
                            .slice(0, 3)
                            .map(
                                (
                                    item,
                                    index
                                ) => (
                                    <span
                                        key={`${candidate.id}-item-${index}`}
                                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"
                                    >
                                        {ui(
                                            item.reliefItemName ||
                                                item.name ||
                                                "ไม่ระบุรายการ"
                                        )}{" "}
                                        {
                                            item.quantity
                                        }{" "}
                                        {ui(
                                            item.unit ||
                                                ""
                                        )}
                                    </span>
                                )
                            )}

                        {items.length > 3 && (
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                                +
                                {items.length -
                                    3}{" "}
                                {tx(
                                    "รายการ",
                                    "more"
                                )}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
}

function CurrentRouteBatch({
    cases,
    ui,
    tx,
}) {
    return (
        <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">
                    local_shipping
                </span>
                <h3 className="font-black text-blue-900">
                    {tx(
                        "จุดส่งที่เพิ่มในรอบนี้",
                        "Additional Stops in This Trip"
                    )}
                </h3>
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-2">
                {cases.map(
                    (
                        request,
                        index
                    ) => (
                        <div
                            key={
                                request.id
                            }
                            className="rounded-xl border border-blue-100 bg-white px-4 py-3"
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">
                                    {index +
                                        1}
                                </span>

                                <div className="min-w-0">
                                    <p className="font-bold text-slate-800">
                                        #
                                        {
                                            request.id
                                        }
                                    </p>
                                    <p className="truncate text-xs text-slate-500">
                                        {request.addressDetail ||
                                            "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </section>
    );
}

function PreparationSummary({
    items,
    caseCount,
    ui,
    tx,
}) {
    const shortage = items.filter(
        (item) => !item.isEnough
    );

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="font-black text-slate-800">
                        {tx(
                            "รายการของที่ต้องเตรียมรวม",
                            "Combined Preparation List"
                        )}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        {tx(
                            `รวมความต้องการจาก ${caseCount} เคสในรอบส่งนี้`,
                            `Combined requirements for ${caseCount} cases in this delivery trip`
                        )}
                    </p>
                </div>

                <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-black ${
                        shortage.length ===
                        0
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {shortage.length ===
                    0
                        ? tx(
                              "ของเพียงพอ",
                              "Stock Ready"
                          )
                        : tx(
                              `ขาด ${shortage.length} รายการ`,
                              `${shortage.length} Item(s) Short`
                          )}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                    <thead className="bg-white text-xs font-bold uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-5 py-3 text-left">
                                {tx(
                                    "รายการ",
                                    "Item"
                                )}
                            </th>
                            <th className="px-4 py-3 text-center">
                                {tx(
                                    "ต้องใช้รวม",
                                    "Required"
                                )}
                            </th>
                            <th className="px-4 py-3 text-center">
                                {tx(
                                    "คงเหลือ",
                                    "Available"
                                )}
                            </th>
                            <th className="px-5 py-3 text-center">
                                {tx(
                                    "ผลตรวจ",
                                    "Result"
                                )}
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {items.map(
                            (item) => (
                                <tr
                                    key={
                                        item.reliefItemId
                                    }
                                    className={
                                        item.isEnough
                                            ? "bg-white"
                                            : "bg-red-50/40"
                                    }
                                >
                                    <td className="px-5 py-3 font-bold text-slate-800">
                                        {ui(
                                            item.reliefItemName
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold">
                                        {
                                            item.requiredQuantity
                                        }{" "}
                                        {ui(
                                            item.unit
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {
                                            item.availableQuantity
                                        }{" "}
                                        {ui(
                                            item.unit
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        {item.isEnough ? (
                                            <span className="font-black text-emerald-700">
                                                {tx(
                                                    "เพียงพอ",
                                                    "Enough"
                                                )}
                                            </span>
                                        ) : (
                                            <span className="font-black text-red-700">
                                                {tx(
                                                    "ขาด",
                                                    "Short"
                                                )}{" "}
                                                {
                                                    item.shortageQuantity
                                                }{" "}
                                                {ui(
                                                    item.unit
                                                )}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function aggregateRequestedItems(
    requests,
    inventories
) {
    const inventoryMap =
        new Map();

    normalizeList(inventories).forEach(
        (inventory) => {
            const id = String(
                inventory.reliefItemId ??
                    inventory.itemId ??
                    inventory.reliefItem?.id ??
                    ""
            );

            if (!id) {
                return;
            }

            inventoryMap.set(id, {
                quantity: Number(
                    inventory.quantity ??
                        inventory.currentQuantity ??
                        0
                ),
                name:
                    inventory.reliefItemName ??
                    inventory.name ??
                    inventory.reliefItem?.name ??
                    "",
                unit:
                    inventory.unit ??
                    inventory.reliefItem?.unit ??
                    "",
            });
        }
    );

    const requiredMap = new Map();

    requests.forEach((request) => {
        const items = Array.isArray(
            request?.items
        )
            ? request.items
            : [];

        items.forEach((item) => {
            const id = String(
                item.reliefItemId ??
                    item.itemId ??
                    item.reliefItem?.id ??
                    ""
            );

            if (!id) {
                return;
            }

            const previous =
                requiredMap.get(id);

            requiredMap.set(id, {
                reliefItemId: id,
                reliefItemName:
                    previous
                        ?.reliefItemName ??
                    item.reliefItemName ??
                    item.name ??
                    item.reliefItem?.name ??
                    inventoryMap.get(id)
                        ?.name ??
                    "ไม่ระบุรายการ",
                unit:
                    previous?.unit ??
                    item.unit ??
                    item.reliefItem?.unit ??
                    inventoryMap.get(id)
                        ?.unit ??
                    "",
                requiredQuantity:
                    Number(
                        previous
                            ?.requiredQuantity ??
                            0
                    ) +
                    Number(
                        item.quantity ??
                            0
                    ),
            });
        });
    });

    return Array.from(
        requiredMap.values()
    ).map((item) => {
        const availableQuantity =
            Number(
                inventoryMap.get(
                    item.reliefItemId
                )?.quantity ?? 0
            );

        const shortageQuantity =
            Math.max(
                item.requiredQuantity -
                    availableQuantity,
                0
            );

        return {
            ...item,
            availableQuantity,
            shortageQuantity,
            isEnough:
                availableQuantity >=
                item.requiredQuantity,
        };
    });
}

function getCoordinate(value) {
    const latitude = Number(
        value?.latitude ??
            value?.Latitude
    );
    const longitude = Number(
        value?.longitude ??
            value?.Longitude
    );

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        Math.abs(latitude) > 90 ||
        Math.abs(longitude) > 180 ||
        (latitude === 0 &&
            longitude === 0)
    ) {
        return null;
    }

    return {
        latitude,
        longitude,
    };
}


function getRouteCorridorKm(
    routeLengthKm
) {
    return Math.min(
        MAX_ROUTE_CORRIDOR_KM,
        Math.max(
            MIN_ROUTE_CORRIDOR_KM,
            routeLengthKm *
                ROUTE_CORRIDOR_RATIO
        )
    );
}

function getMaxRouteDetourKm(
    routeLengthKm
) {
    return Math.min(
        MAX_ALLOWED_DETOUR_KM,
        Math.max(
            MIN_ALLOWED_DETOUR_KM,
            routeLengthKm *
                DETOUR_RATIO
        )
    );
}

function pointToRouteMetric(
    start,
    end,
    point
) {
    if (!start || !end || !point) {
        return {
            progress: -1,
            distanceKm: Infinity,
        };
    }

    const referenceLatitude =
        (start.latitude +
            end.latitude +
            point.latitude) /
        3;

    const kmPerDegreeLatitude =
        111.32;

    const kmPerDegreeLongitude =
        111.32 *
        Math.cos(
            (referenceLatitude *
                Math.PI) /
                180
        );

    const toXY = (coordinate) => ({
        x:
            (coordinate.longitude -
                start.longitude) *
            kmPerDegreeLongitude,
        y:
            (coordinate.latitude -
                start.latitude) *
            kmPerDegreeLatitude,
    });

    const routeEnd = toXY(end);
    const routePoint =
        toXY(point);

    const lengthSquared =
        routeEnd.x *
            routeEnd.x +
        routeEnd.y *
            routeEnd.y;

    if (lengthSquared <= 0) {
        return {
            progress: -1,
            distanceKm:
                haversineKm(
                    start,
                    point
                ),
        };
    }

    const progress =
        (routePoint.x *
            routeEnd.x +
            routePoint.y *
                routeEnd.y) /
        lengthSquared;

    const clampedProgress =
        Math.max(
            0,
            Math.min(1, progress)
        );

    const closest = {
        x:
            routeEnd.x *
            clampedProgress,
        y:
            routeEnd.y *
            clampedProgress,
    };

    const dx =
        routePoint.x -
        closest.x;
    const dy =
        routePoint.y -
        closest.y;

    return {
        progress,
        distanceKm:
            Math.sqrt(
                dx * dx +
                    dy * dy
            ),
    };
}

function haversineKm(
    first,
    second
) {
    const earthRadiusKm =
        6371;

    const toRadians = (value) =>
        (value * Math.PI) / 180;

    const latitudeDelta =
        toRadians(
            second.latitude -
                first.latitude
        );

    const longitudeDelta =
        toRadians(
            second.longitude -
                first.longitude
        );

    const firstLatitude =
        toRadians(
            first.latitude
        );

    const secondLatitude =
        toRadians(
            second.latitude
        );

    const a =
        Math.sin(
            latitudeDelta / 2
        ) ** 2 +
        Math.cos(firstLatitude) *
            Math.cos(
                secondLatitude
            ) *
            Math.sin(
                longitudeDelta / 2
            ) ** 2;

    return (
        2 *
        earthRadiusKm *
        Math.asin(
            Math.sqrt(a)
        )
    );
}

function buildGoogleMapsRouteUrl(
    start,
    end,
    waypoints
) {
    const params =
        new URLSearchParams({
            api: "1",
            origin: `${start.latitude},${start.longitude}`,
            destination: `${end.latitude},${end.longitude}`,
            travelmode: "driving",
        });

    if (waypoints.length > 0) {
        params.set(
            "waypoints",
            waypoints
                .map(
                    (point) =>
                        `${point.latitude},${point.longitude}`
                )
                .join("|")
        );
    }

    return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function readStaffInfo() {
    if (
        typeof window === "undefined"
    ) {
        return {
            id: "",
            centerId: "",
        };
    }

    try {
        const raw =
            localStorage.getItem(
                "staff"
            );

        const staff = raw
            ? JSON.parse(raw)
            : {};

        return {
            id:
                staff?.id ??
                staff?.staffId ??
                staff?.Id ??
                "",
            centerId:
                staff?.centerId ??
                staff?.CenterId ??
                "",
        };
    } catch {
        return {
            id: "",
            centerId: "",
        };
    }
}

function normalizeList(response) {
    if (Array.isArray(response)) {
        return response;
    }

    if (
        Array.isArray(
            response?.data
        )
    ) {
        return response.data;
    }

    if (
        Array.isArray(
            response?.requests
        )
    ) {
        return response.requests;
    }

    if (
        Array.isArray(
            response?.items
        )
    ) {
        return response.items;
    }

    if (
        Array.isArray(
            response?.inventories
        )
    ) {
        return response.inventories;
    }

    return [];
}
