"use client";

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
    InventoryTable,
} from "./ReportTables";

import {
    getDonations,
    getSosRequests,
    getInventoryTransactionsReport,
} from "@/services/admin/report";

function arr(value){
    if(Array.isArray(value)) return value;
    if(Array.isArray(value?.data)) return value.data;
    if(Array.isArray(value?.items)) return value.items;
    if(Array.isArray(value?.requests)) return value.requests;
    if(Array.isArray(value?.donations)) return value.donations;
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
            items.reduce(
                (sum,x)=>sum+Number(x.quantity??0),
                0
            ),
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
        createdAt:item.createdAt,
    };
}

function stockIn(item){
    const type=String(
        item.transactionType??
        item.type??
        ""
    ).toLowerCase().replaceAll("_","-");

    if(["in","stock-in","receive","received","donation","inbound"].includes(type)) return true;
    if(["out","stock-out","withdraw","issue","outbound"].includes(type)) return false;

    return Number(item.quantity??0)>0;
}

function inventoryOf(item,index){
    const isIn=stockIn(item);

    return {
        id:item.id??item.transactionId??String(index+1),
        reliefItemId:item.reliefItemId??"",
        name:item.reliefItemName??item.itemName??"-",
        centerName:item.centerName??"-",
        inQuantity:isIn?Math.abs(Number(item.quantity??0)):0,
        outQuantity:isIn?0:Math.abs(Number(item.quantity??0)),
        balance:item.quantityAfter??item.balance??0,
        unit:item.unit??"หน่วย",
        createdAt:item.createdAt,
    };
}

export default function AdminReport(){
    const [tab,setTab]=useState("donors");
    const [dateFilter,setDateFilter]=useState("");
    const [donations,setDonations]=useState([]);
    const [sos,setSos]=useState([]);
    const [inventory,setInventory]=useState([]);
    const [loading,setLoading]=useState(true);
    const [refreshing,setRefreshing]=useState(false);

    const load=useCallback(async(signal,showLoading=true)=>{
        try{
            showLoading?setLoading(true):setRefreshing(true);

            const [donationResult,sosResult,inventoryResult]=
                await Promise.allSettled([
                    getDonations(signal),
                    getSosRequests(signal),
                    getInventoryTransactionsReport(signal),
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

            const failed=[
                donationResult,
                sosResult,
                inventoryResult,
            ].filter(x=>x.status==="rejected");

            if(failed.length===3){
                throw failed[0].reason;
            }
        }catch(error){
            if(error?.name!=="AbortError"){
                await Swal.fire(
                    "โหลดรายงานไม่สำเร็จ",
                    error?.message||"ไม่สามารถโหลดข้อมูลได้",
                    "error"
                );
            }
        }finally{
            if(!signal?.aborted){
                setLoading(false);
                setRefreshing(false);
            }
        }
    },[]);

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

    const config=useMemo(()=>{
        if(tab==="sos"){
            return {
                title:"รายงานสถานการณ์ผู้ประสบภัย (SOS)",
                ref:"RPT-SOS",
                summary:[
                    ["จำนวนเคสทั้งหมด",shownSos.length],
                    ["รอรับเรื่อง",shownSos.filter(x=>String(x.status).toLowerCase()==="pending").length],
                ],
            };
        }

        if(tab==="inventory"){
            return {
                title:"รายงานการเคลื่อนไหวคลังบริจาค",
                ref:"RPT-INV",
                summary:[
                    ["รายการเคลื่อนไหว",shownInventory.length],
                    ["ยอดรับเข้า",shownInventory.reduce((s,x)=>s+x.inQuantity,0)],
                    ["ยอดจ่ายออก",shownInventory.reduce((s,x)=>s+x.outQuantity,0)],
                ],
            };
        }

        return {
            title:"รายงานสรุปยอดผู้บริจาค",
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
        shownInventory
    ]);

    return <RoleGuard role="Admin" storageKey="admin" loginPath="/admin-login">
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <header className="no-print sticky top-0 z-10 border-b bg-white px-4 py-4">
                <div className="mx-auto flex max-w-[1150px] items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black">ระบบพิมพ์รายงาน</h1>
                        <p className="text-xs text-slate-500">เชื่อมข้อมูลจาก API จริง</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={()=>{
                                const controller=new AbortController();
                                load(controller.signal,false);
                            }}
                            disabled={refreshing}
                            className="rounded-xl border px-4 py-2 text-sm font-bold"
                        >
                            {refreshing?"กำลังอัปเดต...":"อัปเดต"}
                        </button>
                        <button
                            onClick={()=>window.print()}
                            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white"
                        >
                            พิมพ์เอกสาร
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1150px] p-4 md:p-8">
                <ReportTabs value={tab} onChange={setTab}/>

                <section className="print-area mt-6 min-h-[800px] rounded-2xl bg-white p-5 shadow-xl md:p-10">
                    <ReportHeader title={config.title} refCode={config.ref}/>

                    <div className="no-print mb-6 flex flex-wrap items-center gap-3 rounded-xl border bg-slate-50 p-4">
                        <span className="text-sm font-bold">กรองตามวันที่</span>
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
                            แสดงทั้งหมด
                        </button>
                    </div>

                    <div className="mb-8 grid gap-4 rounded-xl border bg-indigo-50 p-6 sm:grid-cols-2 lg:grid-cols-3">
                        {config.summary.map(([label,value])=>
                            <div key={label}>
                                <p className="text-sm font-bold text-slate-500">{label}</p>
                                <p className="mt-1 text-2xl font-black">{value}</p>
                            </div>
                        )}
                    </div>

                    {loading
                        ?<div className="py-24 text-center">กำลังโหลดข้อมูล...</div>
                        :tab==="donors"
                          ?<DonorTable rows={shownDonations}/>
                          :tab==="sos"
                            ?<SosTable rows={shownSos}/>
                            :<InventoryTable rows={shownInventory}/>
                    }

                    <div className="mt-16 flex justify-between border-t pt-8 text-center">
                        <Signature label="ผู้จัดทำรายงาน"/>
                        <Signature label="ผู้ตรวจสอบ"/>
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
