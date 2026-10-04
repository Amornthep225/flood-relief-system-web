"use client";

import { useNativeUi } from "@/hooks/useNativeUi";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import Swal from "sweetalert2";
import RoleGuard from "@/components/RoleGuard/RoleGuard";

import ReportTabs from "./ReportTabs";
import ReportHeader from "./ReportHeader";
import {
    DonorTable,
    SosTable,
    SeverityTable,
    InventoryTable,
    DonationTraceTable,
} from "./ReportTables";

import {
    getDonations,
    getSosRequests,
    getInventoryTransactionsReport,
    getDonationTraceabilityReport,
} from "@/services/admin/report";

function arr(value){
    if(Array.isArray(value)) return value;
    if(Array.isArray(value?.data)) return value.data;
    if(Array.isArray(value?.items)) return value.items;
    if(Array.isArray(value?.requests)) return value.requests;
    if(Array.isArray(value?.donations)) return value.donations;
    if(Array.isArray(value?.transactions)) return value.transactions;
    return [];
}

function inputDate(value){
    const date=new Date(value);
    if(Number.isNaN(date.getTime())) return "";
    const y=date.getFullYear();
    const m=String(date.getMonth()+1).padStart(2,"0");
    const d=String(date.getDate()).padStart(2,"0");
    return `${y}-${m}-${d}`;
}

function donationOf(item,index){
    const items=Array.isArray(item.items)
        ?item.items
        :Array.isArray(item.donationItems)
          ?item.donationItems
          :[];

    return {
        id:item.id??item.donationId??String(index+1),
        donorName:
            item.donorName??
            item.userFullName??
            item.userName??
            "-",
        centerName:
            item.centerName??
            item.center?.centerName??
            "-",
        createdAt:item.createdAt,
        itemsText:
            items.map(x=>
                x.reliefItemName??
                x.itemName??
                x.name
            ).filter(Boolean).join(", ")||"-",
        totalQuantity:
            items.length
                ? items.reduce(
                    (sum,x)=>sum+Number(x.quantity??0),
                    0
                  )
                : Number(item.totalQuantity??item.quantity??0),
    };
}

function sosOf(item){
    return {
        id:item.id??item.sosRequestId??"",
        name:
            item.userFullName??
            item.userName??
            "-",
        place:
            item.addressDetail??
            item.address??
            "-",
        problem:
            item.userRemark??
            item.remark??
            "-",
        status:item.status??"-",
        priority:item.priority??"Normal",
        requestType:item.requestType??"Relief",
        victimCount:Number(item.victimCount??0),
        childCount:Number(item.childCount??0),
        adultCount:Number(item.adultCount??0),
        elderlyCount:Number(item.elderlyCount??0),
        disabledCount:Number(item.disabledCount??0),
        patientCount:Number(item.patientCount??0),
        deathCount:Number(item.deathCount??0),
        severity:item.severity??null,
        victimSeverityCounts:Array.isArray(item.victimSeverityCounts)
            ? item.victimSeverityCounts
            : Array.isArray(item.VictimSeverityCounts)
              ? item.VictimSeverityCounts
              : [],
        createdAt:item.createdAt,
    };
}

function inventoryOf(item,index){
    const direction=String(item.direction??"").toUpperCase();
    const isIn=direction==="IN";

    return {
        id:item.id??item.transactionId??String(index+1),
        reliefItemId:item.reliefItemId??"",
        name:item.reliefItemName??item.itemName??"-",
        centerName:item.centerName??"-",
        direction:isIn?"IN":"OUT",
        transactionType:item.transactionType??"-",
        quantity:Math.abs(Number(item.quantity??0)),
        inQuantity:isIn?Math.abs(Number(item.quantity??0)):0,
        outQuantity:isIn?0:Math.abs(Number(item.quantity??0)),
        balanceBefore:Number(item.balanceBefore??0),
        balance:Number(item.balanceAfter??item.balance??0),
        unit:item.unit??"หน่วย",
        sourceType:item.sourceType??"-",
        sourceName:item.sourceName??"-",
        sourceReference:item.sourceReference??null,
        destinationType:item.destinationType??"-",
        destinationName:item.destinationName??"-",
        destinationReference:item.destinationReference??null,
        destinationAddress:item.destinationAddress??null,
        staffName:item.staffName??"-",
        note:item.note??"",
        createdAt:item.createdAt,
    };
}

function traceOf(item,index){
    return {
        id:item.id??String(index+1),
        createdAt:item.activityAt??item.receivedAt,
        receivedAt:item.receivedAt,
        donationId:item.donationId??"-",
        donationBatchId:item.donationBatchId??"-",
        donorName:item.donorName??"-",
        reliefItemId:item.reliefItemId??"-",
        reliefItemName:item.reliefItemName??"-",
        unit:item.unit??"หน่วย",
        quantity:Number(item.quantity??0),
        centerName:item.centerName??"-",
        flowStatus:item.flowStatus??"-",
        destinationType:item.destinationType??"-",
        destinationName:item.destinationName??"-",
        destinationReference:item.destinationReference??null,
        destinationAddress:item.destinationAddress??null,
        receiveMethod:item.receiveMethod??null,
        requestStatus:item.requestStatus??null,
        staffName:item.staffName??"-",
    };
}

export default function AdminReport(){
    const { ui } = useNativeUi();
    const [tab,setTab]=useState("donors");
    const [dateFilter,setDateFilter]=useState("");
    const [donations,setDonations]=useState([]);
    const [sos,setSos]=useState([]);
    const [inventory,setInventory]=useState([]);
    const [traceability,setTraceability]=useState([]);
    const [loading,setLoading]=useState(true);
    const [refreshing,setRefreshing]=useState(false);

    const load=useCallback(async(signal,showLoading=true)=>{
        try{
            showLoading?setLoading(true):setRefreshing(true);

            const [donationResult,sosResult,inventoryResult,traceabilityResult]=
                await Promise.allSettled([
                    getDonations(signal),
                    getSosRequests(signal),
                    getInventoryTransactionsReport(signal),
                    getDonationTraceabilityReport(signal),
                ]);

            setDonations(
                donationResult.status==="fulfilled"
                    ?arr(donationResult.value).map(donationOf)
                    :[]
            );

            setSos(
                sosResult.status==="fulfilled"
                    ?arr(sosResult.value).map(sosOf)
                    :[]
            );

            setInventory(
                inventoryResult.status==="fulfilled"
                    ?arr(inventoryResult.value).map(inventoryOf)
                    :[]
            );

            setTraceability(
                traceabilityResult.status==="fulfilled"
                    ?arr(traceabilityResult.value).map(traceOf)
                    :[]
            );

            const failed=[
                donationResult,
                sosResult,
                inventoryResult,
                traceabilityResult,
            ].filter(x=>x.status==="rejected");

            if(failed.length===4){
                throw failed[0].reason;
            }
        }catch(error){
            if(error?.name!=="AbortError"){
                await Swal.fire(
                    ui("โหลดรายงานไม่สำเร็จ"),
                    ui(error?.message || "ไม่สามารถโหลดข้อมูลได้"),
                    "error"
                );
            }
        }finally{
            if(!signal?.aborted){
                setLoading(false);
                setRefreshing(false);
            }
        }
    },[ui]);

    useEffect(()=>{
        const controller=new AbortController();
        load(controller.signal);
        return()=>controller.abort();
    },[load]);

    useEffect(()=>{
        setDateFilter("");
    },[tab]);

    const filterByDate=rows=>
        rows.filter(row=>
            !dateFilter||
            inputDate(row.createdAt)===dateFilter
        );

    const shownDonations=useMemo(
        ()=>filterByDate(donations),
        [donations,dateFilter]
    );

    const shownSos=useMemo(
        ()=>filterByDate(sos),
        [sos,dateFilter]
    );

    const shownInventory=useMemo(
        ()=>filterByDate(inventory),
        [inventory,dateFilter]
    );

    const shownEmergencySos=useMemo(
        ()=>shownSos.filter(x=>String(x.requestType||"").toLowerCase()==="emergency"),
        [shownSos]
    );

    const severityRows=useMemo(()=>{
        const levels=[
            {value:"Mild",label:"เล็กน้อย"},
            {value:"Moderate",label:"ปานกลาง"},
            {value:"Severe",label:"รุนแรง"},
            {value:"Critical",label:"วิกฤต"},
        ];

        const normalizeLegacyRow=(request)=>{
            const accounted=
                Number(request.childCount||0)+
                Number(request.elderlyCount||0)+
                Number(request.disabledCount||0)+
                Number(request.patientCount||0);

            return {
                severity:request.severity||"Mild",
                childCount:Number(request.childCount||0),
                adultCount:Math.max(
                    Number(request.adultCount||0) ||
                    (Number(request.victimCount||0)-accounted),
                    0
                ),
                elderlyCount:Number(request.elderlyCount||0),
                disabledCount:Number(request.disabledCount||0),
                patientCount:Number(request.patientCount||0),
            };
        };

        return levels.map(level=>{
            const matchingRows=[];

            shownEmergencySos.forEach((request)=>{
                const breakdown=Array.isArray(request.victimSeverityCounts)
                    ?request.victimSeverityCounts
                    :[];

                if(breakdown.length){
                    const row=breakdown.find(
                        x=>String(x.severity||"").toLowerCase()===level.value.toLowerCase()
                    );

                    if(row){
                        matchingRows.push({
                            ...row,
                            childCount:Number(row.childCount||0),
                            adultCount:Number(row.adultCount||0),
                            elderlyCount:Number(row.elderlyCount||0),
                            disabledCount:Number(row.disabledCount||0),
                            patientCount:Number(row.patientCount||0),
                        });
                    }
                    return;
                }

                const legacy=normalizeLegacyRow(request);
                if(String(legacy.severity||"").toLowerCase()===level.value.toLowerCase()){
                    matchingRows.push(legacy);
                }
            });

            const rowTotal=(row)=>
                Number(row.childCount||0)+
                Number(row.adultCount||0)+
                Number(row.elderlyCount||0)+
                Number(row.disabledCount||0)+
                Number(row.patientCount||0);

            return {
                severity:level.value,
                label:level.label,
                caseCount:matchingRows.filter(row=>rowTotal(row)>0).length,
                victimCount:matchingRows.reduce((sum,row)=>sum+rowTotal(row),0),
                injuredCount:matchingRows.reduce((sum,row)=>sum+Number(row.patientCount||0),0),
                childCount:matchingRows.reduce((sum,row)=>sum+Number(row.childCount||0),0),
                adultCount:matchingRows.reduce((sum,row)=>sum+Number(row.adultCount||0),0),
                elderlyCount:matchingRows.reduce((sum,row)=>sum+Number(row.elderlyCount||0),0),
                disabledCount:matchingRows.reduce((sum,row)=>sum+Number(row.disabledCount||0),0),
            };
        });
    },[shownEmergencySos]);

    const shownTraceability=useMemo(
        ()=>filterByDate(traceability),
        [traceability,dateFilter]
    );

    const config=useMemo(()=>{
        if(tab==="sos"){
            return {
                title: ui("รายงานสถานการณ์ผู้ประสบภัย (SOS)"),
                ref:"RPT-SOS",
                summary:[
                    ["จำนวนเคสทั้งหมด",shownSos.length],
                    ["รอรับเรื่อง",shownSos.filter(x=>String(x.status).toLowerCase()==="pending").length],
                    ["ผู้เสียชีวิตทั้งหมด",shownSos.reduce((sum,x)=>sum+Number(x.deathCount||0),0)],
                ],
            };
        }

        if(tab==="severity"){
            return {
                title: ui("รายงานความรุนแรงของผู้ประสบภัย"),
                ref:"RPT-SEVERITY",
                summary:[
                    ["เคสฉุกเฉินทั้งหมด",shownEmergencySos.length],
                    ["ผู้ประสบภัยรวม",shownEmergencySos.reduce((sum,x)=>sum+Number(x.victimCount||0),0)],
                    ["ผู้บาดเจ็บ/ผู้ป่วยรวม",shownEmergencySos.reduce((sum,x)=>sum+Number(x.patientCount||0),0)],
                    ["ผู้เสียชีวิตรวม",shownEmergencySos.reduce((sum,x)=>sum+Number(x.deathCount||0),0)],
                ],
            };
        }

        if(tab==="inventory"){
            return {
                title: ui("รายงานการเคลื่อนไหวคลังบริจาค"),
                ref:"RPT-INV",
                summary:[
                    ["รายการเคลื่อนไหว",shownInventory.length],
                    ["ยอดรับเข้า",shownInventory.reduce((s,x)=>s+x.inQuantity,0)],
                    ["ยอดจ่ายออก",shownInventory.reduce((s,x)=>s+x.outQuantity,0)],
                ],
            };
        }

        if(tab==="traceability"){
            return {
                title: ui("รายงานเส้นทางสิ่งของบริจาค"),
                ref:"RPT-TRACE",
                summary:[
                    ["รายการติดตาม",shownTraceability.length],
                    ["จัดสรรช่วยเหลือแล้ว",shownTraceability.filter(x=>x.flowStatus==="Allocated").reduce((s,x)=>s+x.quantity,0)],
                    ["ยังอยู่ในคลัง",shownTraceability.filter(x=>x.flowStatus==="InStock").reduce((s,x)=>s+x.quantity,0)],
                ],
            };
        }

        return {
            title: ui("รายงานสรุปยอดผู้บริจาค"),
            ref:"RPT-DON",
            summary:[
                ["รายการบริจาค",shownDonations.length],
                ["จำนวนสิ่งของรวม",shownDonations.reduce((s,x)=>s+x.totalQuantity,0)],
            ],
        };
    },[
        tab,
        shownDonations,
        shownSos,
        shownEmergencySos,
        shownInventory,
        shownTraceability,
        ui,
    ]);

    return <RoleGuard role="Admin" storageKey="admin" loginPath="/admin-login">
        <div className="min-h-[100dvh] bg-slate-100 text-slate-800">
            <header className="no-print relative z-10 border-b bg-white px-3 py-3 sm:px-4 sm:py-4 lg:sticky lg:top-0">
                <div className="mx-auto flex max-w-[1150px] flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-black">{ui("ระบบพิมพ์รายงาน")}</h1>
                        <p className="text-xs text-slate-500">{ui("เชื่อมข้อมูลจาก API จริง")}</p>
                    </div>
                    <div className="flex w-full gap-2 sm:w-auto">
                        <button
                            onClick={()=>{
                                const controller=new AbortController();
                                load(controller.signal,false);
                            }}
                            disabled={refreshing}
                            className="flex-1 rounded-xl border px-4 py-2 text-sm font-bold sm:flex-none"
                        >
                            {refreshing ? ui("กำลังอัปเดต...") : ui("อัปเดต")}
                        </button>
                        <button
                            onClick={()=>window.print()}
                            className="flex-1 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white sm:flex-none"
                        >
                            {ui("พิมพ์เอกสาร")}
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1150px] p-4 md:p-8">
                <ReportTabs value={tab} onChange={setTab}/>

                <section className="print-area mt-6 min-h-[800px] rounded-2xl bg-white p-5 shadow-xl md:p-10">
                    <ReportHeader title={config.title} refCode={config.ref}/>

                    <div className="no-print mb-6 flex flex-wrap items-center gap-3 rounded-xl border bg-slate-50 p-4">
                        <span className="text-sm font-bold">{ui("กรองตามวันที่")}</span>
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={e=>setDateFilter(e.target.value)}
                            className="rounded-lg border bg-white p-2 text-sm"
                        />
                        <button
                            onClick={()=>setDateFilter("")}
                            className="text-sm font-bold text-indigo-600"
                        >
                            {ui("แสดงทั้งหมด")}
                        </button>
                    </div>

                    <div className="mb-8 grid gap-4 rounded-xl border bg-indigo-50 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
                        {config.summary.map(([label,value])=>
                            <div key={label}>
                                <p className="text-sm font-bold text-slate-500">{ui(label)}</p>
                                <p className="mt-1 text-2xl font-black">{value}</p>
                            </div>
                        )}
                    </div>

                    {loading
                        ?<div className="py-24 text-center">{ui("กำลังโหลดข้อมูล...")}</div>
                        :tab==="donors"
                          ?<DonorTable rows={shownDonations}/>
                          :tab==="sos"
                            ?<SosTable rows={shownSos}/>
                            :tab==="severity"
                              ?<SeverityTable rows={severityRows}/>
                              :tab==="inventory"
                                ?<InventoryTable rows={shownInventory}/>
                                :<DonationTraceTable rows={shownTraceability}/>
                    }

                    <div className="mt-16 flex justify-between border-t pt-8 text-center">
                        <Signature label={ui("ผู้จัดทำรายงาน")}/>
                        <Signature label={ui("ผู้ตรวจสอบ")}/>
                    </div>
                </section>
            </main>
        </div>
    </RoleGuard>;
}

function Signature({label}){
    return <div>
        <div className="mb-2 h-8 w-36 border-b border-dotted border-slate-400 md:w-48"/>
        <p className="text-xs text-slate-500">{label}</p>
    </div>;
}
