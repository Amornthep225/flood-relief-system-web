"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

function dateText(value, language) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat(
        language === "en" ? "en-US" : "th-TH",
        { dateStyle: "medium", timeStyle: "short" }
    ).format(date);
}

function movementLabel(type, direction, ui){
    const key=String(type||"").toLowerCase();
    if(key==="donationin") return ui("รับบริจาคเข้าคลัง");
    if(key==="sosout") return ui("จ่ายช่วยเหลือ");
    if(key==="manualin") return ui("รับเข้าคลัง");
    if(key==="manualout") return ui("จ่ายออกจากคลัง");
    return direction==="IN"?ui("รับเข้า"):ui("จ่ายออก");
}

function destinationTypeLabel(type, ui){
    if(type==="EmergencySOS") return ui("SOS ฉุกเฉิน");
    if(type==="ReliefRequest") return ui("คำขอรับสิ่งของ");
    if(type==="Inventory"||type==="Center") return ui("คลังศูนย์");
    return ui(type||"-");
}

function flowStatusLabel(status, ui){
    return status==="Allocated"
        ?ui("นำไปช่วยเหลือแล้ว")
        :status==="InStock"
          ?ui("ยังอยู่ในคลัง")
          :ui(status||"-");
}

function receiveMethodLabel(value, ui){
    if(value==="Pickup") return ui("รับเองที่ศูนย์");
    if(value==="Delivery") return ui("เจ้าหน้าที่จัดส่ง");
    return value?ui(value):"-";
}

function Empty({ text }){
    return <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-400">{text}</div>;
}

export function DonorTable({ rows }) {
    const { ui, language } = useNativeUi();
    if(!rows.length) return <Empty text={ui("ไม่พบข้อมูล")}/>;

    return (
        <>
            <div className="divide-y divide-slate-100 md:hidden">
                {rows.map((row) => (
                    <article key={row.id} className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="font-bold text-slate-800">{row.donorName || "-"}</p>
                                <p className="mt-1 text-xs text-slate-400">{dateText(row.createdAt, language)}</p>
                            </div>
                            <span className="shrink-0 rounded-lg bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-500">#{row.id}</span>
                        </div>
                        <div className="mt-4 rounded-xl bg-slate-50 p-3">
                            <p className="text-[11px] font-bold text-slate-400">{ui("รายการสิ่งของ")}</p>
                            <p className="mt-1 break-words text-sm text-slate-700">{ui(row.itemsText) || "-"}</p>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-slate-100 p-3">
                                <p className="text-[11px] font-bold text-slate-400">{ui("ศูนย์")}</p>
                                <p className="mt-1 break-words text-sm font-semibold text-slate-700">{ui(row.centerName) || "-"}</p>
                            </div>
                            <div className="rounded-xl border border-slate-100 p-3 text-right">
                                <p className="text-[11px] font-bold text-slate-400">{ui("จำนวน")}</p>
                                <p className="mt-1 text-lg font-black text-slate-800">{row.totalQuantity ?? 0}</p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
            <Table headers={[ui("วันที่"), "Donation ID", ui("ผู้บริจาค"), ui("รายการสิ่งของ"), ui("ศูนย์"), ui("จำนวน")]}> 
                {rows.map((row) => (
                    <tr key={row.id} className="border-b align-top">
                        <Td muted>{dateText(row.createdAt, language)}</Td>
                        <Td mono>#{row.id}</Td>
                        <Td strong>{row.donorName}</Td>
                        <Td>{ui(row.itemsText)}</Td>
                        <Td muted>{ui(row.centerName)}</Td>
                        <Td center strong>{row.totalQuantity}</Td>
                    </tr>
                ))}
            </Table>
        </>
    );
}

export function SosTable({ rows }) {
    const { ui, language } = useNativeUi();
    if(!rows.length) return <Empty text={ui("ไม่พบข้อมูล")}/>;

    return (
        <>
            <div className="divide-y divide-slate-100 md:hidden">
                {rows.map((row) => (
                    <article key={row.id} className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="font-bold text-slate-800">{row.name || "-"}</p>
                                <p className="mt-1 text-xs text-slate-400">{dateText(row.createdAt, language)}</p>
                            </div>
                            <span className="shrink-0 rounded-lg bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-500">#{row.id}</span>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm">
                            <div className="rounded-xl bg-slate-50 p-3">
                                <p className="text-[11px] font-bold text-slate-400">{ui("สถานที่")}</p>
                                <p className="mt-1 break-words text-slate-700">{row.place || "-"}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-3">
                                <p className="text-[11px] font-bold text-slate-400">{ui("รายละเอียด")}</p>
                                <p className="mt-1 break-words text-slate-700">{row.problem || "-"}</p>
                            </div>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                            <Metric label={ui("ผู้เสียชีวิต")} value={row.deathCount||0} danger={row.deathCount>0}/>
                            <Metric label={ui("ระดับ")} value={ui(row.priority)}/>
                            <Metric label={ui("สถานะ")} value={ui(row.status)}/>
                        </div>
                    </article>
                ))}
            </div>
            <Table headers={[ui("วันที่"), "Case ID", ui("ผู้แจ้ง"), ui("สถานที่"), ui("รายละเอียด"), ui("ผู้เสียชีวิต"), ui("ระดับ"), ui("สถานะ")]}> 
                {rows.map((row) => (
                    <tr key={row.id} className="border-b align-top">
                        <Td muted>{dateText(row.createdAt, language)}</Td>
                        <Td mono>#{row.id}</Td>
                        <Td strong>{row.name}</Td>
                        <Td>{row.place}</Td>
                        <Td>{row.problem}</Td>
                        <Td center strong className={row.deathCount>0?"text-red-600":"text-slate-400"}>{row.deathCount||0}</Td>
                        <Td center strong>{ui(row.priority)}</Td>
                        <Td center strong>{ui(row.status)}</Td>
                    </tr>
                ))}
            </Table>
        </>
    );
}

export function SeverityTable({ rows }) {
    const { ui, language } = useNativeUi();
    const severityLabel=(value,label)=>{
        const key=String(value||"").toLowerCase();
        if(language==="en"){
            if(key==="mild") return "Mild";
            if(key==="moderate") return "Moderate";
            if(key==="severe") return "Severe";
            if(key==="critical") return "Critical";
        }
        return label||value||"-";
    };

    if(!rows.length) return <Empty text={ui("ยังไม่มีข้อมูลความรุนแรงของผู้ประสบภัย")}/>;

    return (
        <>
            <div className="space-y-3 md:hidden">
                {rows.map((row)=>(
                    <article key={row.severity} className="rounded-2xl border border-slate-200 p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-bold text-slate-400">{ui("ระดับความรุนแรง")}</p>
                                <p className={`mt-1 text-lg font-black ${severityTone(row.severity)}`}>
                                    {severityLabel(row.severity,row.label)}
                                </p>
                            </div>
                            <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">
                                <p className="text-[10px] font-bold text-slate-400">{ui("จำนวนเคส")}</p>
                                <p className="text-xl font-black text-slate-800">{row.caseCount}</p>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                            <Metric label={ui("ผู้ประสบภัย")} value={row.victimCount}/>
                            <Metric label={ui("ผู้บาดเจ็บ/ผู้ป่วย")} value={row.injuredCount} danger={row.injuredCount>0}/>
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
                            <Metric label={ui("เด็ก")} value={row.childCount}/>
                            <Metric label={ui("ผู้ใหญ่")} value={row.adultCount}/>
                            <Metric label={ui("ผู้สูงอายุ")} value={row.elderlyCount}/>
                            <Metric label={ui("ผู้พิการ")} value={row.disabledCount}/>
                        </div>
                    </article>
                ))}
            </div>

            <Table headers={[
                ui("ระดับความรุนแรง"),
                ui("จำนวนเคส"),
                ui("ผู้ประสบภัย"),
                ui("ผู้บาดเจ็บ/ผู้ป่วย"),
                ui("เด็ก"),
                ui("ผู้ใหญ่"),
                ui("ผู้สูงอายุ"),
                ui("ผู้พิการ"),
            ]}>
                {rows.map((row)=>(
                    <tr key={row.severity} className="border-b">
                        <Td strong className={severityTone(row.severity)}>
                            {severityLabel(row.severity,row.label)}
                        </Td>
                        <Td center strong>{row.caseCount}</Td>
                        <Td center strong>{row.victimCount}</Td>
                        <Td center strong className={row.injuredCount>0?"text-orange-600":"text-slate-400"}>{row.injuredCount}</Td>
                        <Td center>{row.childCount}</Td>
                        <Td center>{row.adultCount}</Td>
                        <Td center>{row.elderlyCount}</Td>
                        <Td center>{row.disabledCount}</Td>
                    </tr>
                ))}
            </Table>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
                {ui("หมายเหตุ: เคสใหม่สรุปจำนวนแยกตามระดับความรุนแรงโดยตรง ส่วนข้อมูลเก่าจะถูกจัดเข้าระดับเดิมของเคสนั้นเพื่อให้รายงานย้อนหลังยังใช้งานได้")}
            </div>
        </>
    );
}

function severityTone(value){
    const key=String(value||"").toLowerCase();
    if(key==="critical") return "text-red-600";
    if(key==="severe") return "text-orange-600";
    if(key==="moderate") return "text-amber-600";
    return "text-emerald-600";
}

export function InventoryTable({ rows }) {
    const { ui, language } = useNativeUi();
    if(!rows.length) return <Empty text={ui("ยังไม่มีรายการเคลื่อนไหวคลัง")}/>;

    return (
        <>
            <div className="space-y-3 md:hidden">
                {rows.map((row, index) => (
                    <article key={row.id || index} className="rounded-2xl border border-slate-200 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="font-bold text-slate-800">{ui(row.name)||"-"}</p>
                                <p className="mt-1 text-xs text-slate-400">{dateText(row.createdAt, language)}</p>
                            </div>
                            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${row.direction==="IN"?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-700"}`}>
                                {movementLabel(row.transactionType,row.direction,ui)}
                            </span>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                            <Metric label={ui("จำนวน")} value={`${row.direction==="IN"?"+":"-"}${row.quantity} ${ui(row.unit)}`}/>
                            <Metric label={ui("ก่อนทำรายการ")} value={row.balanceBefore}/>
                            <Metric label={ui("คงเหลือ")} value={row.balance}/>
                        </div>

                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            <RouteBox title={ui("ที่มา")} name={row.sourceName} reference={row.sourceReference}/>
                            <RouteBox title={ui("ปลายทาง")} name={row.destinationName} reference={row.destinationReference} detail={row.destinationAddress}/>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                            <span>{ui(row.centerName)}</span>
                            <span>{ui("ดำเนินการโดย")}: {row.staffName||"-"}</span>
                        </div>
                    </article>
                ))}
            </div>

            <Table headers={[
                ui("วันที่"),
                ui("รายการ"),
                ui("การเคลื่อนไหว"),
                ui("จำนวน / คงเหลือ"),
                ui("ที่มา"),
                ui("ปลายทาง"),
                ui("ผู้ดำเนินการ"),
            ]}>
                {rows.map((row,index)=>(
                    <tr key={row.id||index} className="border-b align-top">
                        <Td muted>{dateText(row.createdAt,language)}</Td>
                        <Td>
                            <p className="font-bold text-slate-800">{ui(row.name)}</p>
                            <p className="mt-1 text-[11px] text-slate-400">{ui(row.centerName)} · {ui(row.unit)}</p>
                        </Td>
                        <Td>
                            <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-black ${row.direction==="IN"?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-700"}`}>
                                {movementLabel(row.transactionType,row.direction,ui)}
                            </span>
                        </Td>
                        <Td center>
                            <p className={`font-black ${row.direction==="IN"?"text-emerald-700":"text-red-700"}`}>
                                {row.direction==="IN"?"+":"-"}{row.quantity} {ui(row.unit)}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-400">{row.balanceBefore} → {row.balance}</p>
                        </Td>
                        <Td>
                            <p className="font-semibold">{row.sourceName||"-"}</p>
                            {row.sourceReference&&<p className="mt-1 font-mono text-[10px] text-slate-400">{row.sourceReference}</p>}
                        </Td>
                        <Td>
                            <p className="font-semibold">{row.destinationName||"-"}</p>
                            {row.destinationReference&&<p className="mt-1 font-mono text-[10px] text-slate-400">{row.destinationReference}</p>}
                            {row.destinationAddress&&<p className="mt-1 line-clamp-2 text-[10px] text-slate-400">{row.destinationAddress}</p>}
                        </Td>
                        <Td muted>{row.staffName||"-"}</Td>
                    </tr>
                ))}
            </Table>
        </>
    );
}

export function DonationTraceTable({ rows }){
    const { ui, language } = useNativeUi();
    if(!rows.length) return <Empty text={ui("ยังไม่มีข้อมูลเส้นทางสิ่งของบริจาค")}/>;

    return <>
        <div className="space-y-3 md:hidden">
            {rows.map((row,index)=><article key={row.id||index} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="font-bold text-slate-800">{ui(row.reliefItemName)}</p>
                        <p className="mt-1 text-xs text-slate-400">{dateText(row.createdAt,language)}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${row.flowStatus==="Allocated"?"bg-blue-50 text-blue-700":"bg-emerald-50 text-emerald-700"}`}>
                        {flowStatusLabel(row.flowStatus,ui)}
                    </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                    <RouteBox title={ui("จากผู้บริจาค")} name={row.donorName} reference={`Donation #${row.donationId}`}/>
                    <RouteBox
                        title={ui("ปลายทาง")}
                        name={row.destinationName}
                        reference={row.destinationReference||destinationTypeLabel(row.destinationType,ui)}
                        detail={row.destinationAddress}
                    />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                    <span className="text-slate-500">{ui(row.centerName)}</span>
                    <span className="font-black text-slate-800">{row.quantity} {ui(row.unit)}</span>
                </div>

                {row.flowStatus==="Allocated"&&<div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>{destinationTypeLabel(row.destinationType,ui)}</span>
                    <span>{receiveMethodLabel(row.receiveMethod,ui)}</span>
                    <span>{ui("เจ้าหน้าที่")}: {row.staffName||"-"}</span>
                </div>}
            </article>)}
        </div>

        <Table headers={[
            ui("วันที่"),
            "Donation ID",
            ui("ผู้บริจาค"),
            ui("สิ่งของ / จำนวน"),
            ui("ศูนย์"),
            ui("ปลายทาง"),
            ui("สถานะ"),
        ]}>
            {rows.map((row,index)=><tr key={row.id||index} className="border-b align-top">
                <Td muted>{dateText(row.createdAt,language)}</Td>
                <Td mono>#{row.donationId}</Td>
                <Td strong>{row.donorName}</Td>
                <Td>
                    <p className="font-bold">{ui(row.reliefItemName)}</p>
                    <p className="mt-1 text-[11px] text-slate-500">{row.quantity} {ui(row.unit)}</p>
                </Td>
                <Td>{ui(row.centerName)}</Td>
                <Td>
                    <p className="font-semibold">{row.destinationName}</p>
                    <p className="mt-1 text-[10px] font-bold text-indigo-600">{destinationTypeLabel(row.destinationType,ui)}</p>
                    {row.destinationReference&&<p className="mt-1 font-mono text-[10px] text-slate-400">{row.destinationReference}</p>}
                    {row.destinationAddress&&<p className="mt-1 line-clamp-2 text-[10px] text-slate-400">{row.destinationAddress}</p>}
                </Td>
                <Td>
                    <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-black ${row.flowStatus==="Allocated"?"bg-blue-50 text-blue-700":"bg-emerald-50 text-emerald-700"}`}>
                        {flowStatusLabel(row.flowStatus,ui)}
                    </span>
                    {row.flowStatus==="Allocated"&&<>
                        <p className="mt-1 text-[10px] text-slate-500">{receiveMethodLabel(row.receiveMethod,ui)}</p>
                        <p className="mt-1 text-[10px] text-slate-400">{row.staffName||"-"}</p>
                    </>}
                </Td>
            </tr>)}
        </Table>
    </>;
}

function Metric({label,value,danger=false}){
    return <div className="rounded-xl border border-slate-100 p-3">
        <p className="text-[10px] font-bold text-slate-400">{label}</p>
        <p className={`mt-1 break-words text-xs font-black ${danger?"text-red-600":"text-slate-700"}`}>{value}</p>
    </div>;
}

function RouteBox({title,name,reference,detail}){
    return <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-[10px] font-bold text-slate-400">{title}</p>
        <p className="mt-1 break-words text-sm font-bold text-slate-700">{name||"-"}</p>
        {reference&&<p className="mt-1 break-words font-mono text-[10px] text-slate-400">{reference}</p>}
        {detail&&<p className="mt-1 break-words text-[10px] text-slate-400">{detail}</p>}
    </div>;
}

function Td({children,muted=false,mono=false,strong=false,center=false,className=""}){
    return <td className={`p-2.5 leading-5 ${muted?"text-slate-500":"text-slate-700"} ${mono?"font-mono text-[11px]":""} ${strong?"font-bold":""} ${center?"text-center":""} ${className}`}>{children}</td>;
}

function Table({ headers, children }) {
    return (
        <div className="hidden md:block">
            <table className="w-full table-fixed text-left text-xs lg:text-sm">
                <thead className="bg-slate-100 text-[11px] font-black uppercase text-slate-600">
                    <tr>{headers.map((header,index) => <th key={`${header}-${index}`} className="p-2.5 align-top">{header}</th>)}</tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
}
