import { API_URL } from "@/services/config";

function getToken(){
    if(typeof window==="undefined") return null;
    const token=localStorage.getItem("token");
    if(token) return token;
    try{
        const admin=JSON.parse(localStorage.getItem("admin")||"{}");
        return admin?.token||admin?.accessToken||admin?.jwtToken||null;
    }catch{return null;}
}

async function request(url,options={}){
    const token=getToken();
    if(!token) throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");

    const response=await fetch(url,{
        ...options,
        headers:{
            Accept:"application/json",
            Authorization:`Bearer ${token}`,
            ...(options.headers||{})
        },
        cache:"no-store"
    });

    const text=await response.text();
    let data=null;

    if(text){
        try{data=JSON.parse(text);}
        catch{data=text;}
    }

    if(!response.ok){
        if(response.status===401) throw new Error("Token หมดอายุ กรุณาเข้าสู่ระบบใหม่");
        if(response.status===403) throw new Error(data?.message||"คุณไม่มีสิทธิ์ใช้งานส่วนนี้");
        throw new Error(data?.message||data?.title||`เกิดข้อผิดพลาด (${response.status})`);
    }

    return data;
}

export const getDonations=(signal)=>
    request(`${API_URL}/Donations`,{method:"GET",signal});

export const getSosRequests=(signal)=>
    request(`${API_URL}/sos-requests`,{method:"GET",signal});

// ใช้ endpoint รายงานโดยตรง ลดการยิง API แบบ N+1 ทีละคลัง
export const getInventoryTransactionsReport=(signal)=>
    request(`${API_URL}/CenterInventories/report/movements`,{
        method:"GET",
        signal,
    });

// ติดตามของบริจาคตั้งแต่ผู้บริจาค -> คลัง -> เคสที่นำไปช่วย
export const getDonationTraceabilityReport=(signal)=>
    request(`${API_URL}/Donations/report/traceability`,{
        method:"GET",
        signal,
    });
