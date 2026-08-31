"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

function dateText(value, language){
    if(!value) return "-";
    const date=new Date(value);
    if(Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat(language === "en" ? "en-US" : "th-TH",{dateStyle:"medium"}).format(date);
}

export function DonorTable({rows}){
    const { ui, language } = useNativeUi();
    return <Table headers={[ui("วันที่"),"Donation ID",ui("ผู้บริจาค"),ui("รายการสิ่งของ"),ui("ศูนย์"),ui("จำนวน")]}>
        {rows.map(row=><tr key={row.id} className="border-b">
            <td className="p-4 text-slate-500">{dateText(row.createdAt, language)}</td>
            <td className="p-4 font-mono text-xs">#{row.id}</td>
            <td className="p-4 font-bold">{row.donorName}</td>
            <td className="p-4 text-slate-600">{ui(row.itemsText)}</td>
            <td className="p-4 text-slate-500">{ui(row.centerName)}</td>
            <td className="p-4 text-right font-bold">{row.totalQuantity}</td>
        </tr>)}
    </Table>;
}

export function SosTable({rows}){
    const { ui, language } = useNativeUi();
    return <Table headers={[ui("วันที่"),"Case ID",ui("ผู้แจ้ง"),ui("สถานที่"),ui("รายละเอียด"),ui("ระดับ"),ui("สถานะ")]}>
        {rows.map(row=><tr key={row.id} className="border-b">
            <td className="p-4 text-slate-500">{dateText(row.createdAt, language)}</td>
            <td className="p-4 font-mono text-xs">#{row.id}</td>
            <td className="p-4 font-bold">{row.name}</td>
            <td className="p-4 text-slate-600">{row.place}</td>
            <td className="p-4 text-slate-600">{row.problem}</td>
            <td className="p-4 text-center font-bold">{ui(row.priority)}</td>
            <td className="p-4 text-center font-bold">{ui(row.status)}</td>
        </tr>)}
    </Table>;
}

export function InventoryTable({rows}){
    const { ui, language } = useNativeUi();
    return <Table headers={[ui("วันที่"),ui("รายการ"),ui("ศูนย์"),ui("รับเข้า"),ui("จ่ายออก"),ui("คงเหลือ"),ui("หน่วย")]}>
        {rows.map((row,index)=><tr key={row.id||index} className="border-b">
            <td className="p-4 text-slate-500">{dateText(row.createdAt, language)}</td>
            <td className="p-4">
                <p className="font-bold">{ui(row.name)}</p>
                <p className="font-mono text-xs text-slate-400">#{row.reliefItemId}</p>
            </td>
            <td className="p-4">{ui(row.centerName)}</td>
            <td className="p-4 text-center font-bold text-emerald-600">{row.inQuantity?`+${row.inQuantity}`:"-"}</td>
            <td className="p-4 text-center font-bold text-red-600">{row.outQuantity?`-${row.outQuantity}`:"-"}</td>
            <td className="p-4 text-center font-bold">{row.balance}</td>
            <td className="p-4 text-center">{ui(row.unit)}</td>
        </tr>)}
    </Table>;
}

function Table({headers,children}){
    return <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                <tr>{headers.map(header=><th key={header} className="p-4">{header}</th>)}</tr>
            </thead>
            <tbody>{children}</tbody>
        </table>
    </div>;
}
