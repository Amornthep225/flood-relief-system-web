export default function GpsModal({
    request,
    onClose,
}) {
    const latitude = Number(request.latitude);
    const longitude = Number(request.longitude);

    const hasCoordinates =
        Number.isFinite(latitude) &&
        Number.isFinite(longitude);

    const googleMapsUrl = hasCoordinates
        ? `https://www.google.com/maps?q=${latitude},${longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              request.addressDetail || ""
          )}`;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                    <div>
                        <h3 className="flex items-center gap-2 font-bold text-slate-800">
                            <span className="material-symbols-outlined text-red-500">
                                location_on
                            </span>
                            ตำแหน่งผู้ประสบภัย
                        </h3>

                        <p className="mt-1 font-mono text-xs text-slate-400">
                            SOS #{request.id}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                    >
                        <span className="material-symbols-outlined text-lg">
                            close
                        </span>
                    </button>
                </div>

                <div className="bg-sky-50 p-6">
                    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-sky-100 bg-white p-6 text-center">
                        <span className="material-symbols-outlined text-6xl text-red-500">
                            location_on
                        </span>

                        <p className="mt-4 font-bold text-slate-800">
                            {request.addressDetail ||
                                "ไม่ระบุรายละเอียดสถานที่"}
                        </p>

                        {hasCoordinates && (
                            <p className="mt-2 font-mono text-xs text-slate-400">
                                {latitude}, {longitude}
                            </p>
                        )}
                    </div>

                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-3.5 font-bold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700"
                    >
                        <span className="material-symbols-outlined">
                            near_me
                        </span>
                        นำทางด้วย Google Maps
                    </a>
                </div>
            </div>
        </div>
    );
}