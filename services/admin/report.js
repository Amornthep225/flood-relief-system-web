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

function arr(value){
    if(Array.isArray(value)) return value;
    if(Array.isArray(value?.data)) return value.data;
    if(Array.isArray(value?.items)) return value.items;
    if(Array.isArray(value?.requests)) return value.requests;
    if(Array.isArray(value?.donations)) return value.donations;
    if(Array.isArray(value?.centers)) return value.centers;
    if(Array.isArray(value?.inventories)) return value.inventories;
    if(Array.isArray(value?.transactions)) return value.transactions;
    return [];
}

export const getDonations=(signal)=>
    request(`${API_URL}/Donations`,{method:"GET",signal});

export const getSosRequests=(signal)=>
    request(`${API_URL}/sos-requests`,{method:"GET",signal});

export async function getInventoryTransactionsReport(signal){
    const centers=arr(
        await request(`${API_URL}/Centers`,{method:"GET",signal})
    );

    const inventoryResults=await Promise.allSettled(
        centers.map(async center=>{
            const centerId=center.id??center.centerId;
            if(!centerId) return [];

            const inventories=arr(
                await request(
                    `${API_URL}/CenterInventories/center/${encodeURIComponent(centerId)}`,
                    {method:"GET",signal}
                )
            );

            return inventories.map(inventory=>({
                ...inventory,
                centerId:inventory.centerId??centerId,
                centerName:
                    inventory.centerName??
                    center.centerName??
                    center.name??
                    "-"
            }));
        })
    );

    const inventories=inventoryResults
        .filter(x=>x.status==="fulfilled")
        .flatMap(x=>x.value);

    const transactionResults=await Promise.allSettled(
        inventories.map(async inventory=>{
            if(!inventory.id) return [];

            const transactions=arr(
                await request(
                    `${API_URL}/CenterInventories/${encodeURIComponent(inventory.id)}/transactions`,
                    {method:"GET",signal}
                )
            );

            return transactions.map(transaction=>({
                ...transaction,
                centerInventoryId:
                    transaction.centerInventoryId??inventory.id,
                centerName:
                    transaction.centerName??inventory.centerName,
                reliefItemId:
                    transaction.reliefItemId??inventory.reliefItemId,
                reliefItemName:
                    transaction.reliefItemName??inventory.reliefItemName,
                unit:
                    transaction.unit??inventory.unit??"หน่วย",
                balance:
                    transaction.quantityAfter??
                    inventory.quantity??
                    0
            }));
        })
    );

    return transactionResults
        .filter(x=>x.status==="fulfilled")
        .flatMap(x=>x.value);
}
