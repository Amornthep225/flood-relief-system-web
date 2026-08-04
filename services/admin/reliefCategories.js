import { API_URL } from "@/services/config";

function token(){
  if(typeof window==="undefined") return null;
  const direct=localStorage.getItem("token");
  if(direct) return direct;
  try{
    const admin=JSON.parse(localStorage.getItem("admin")||"{}");
    return admin?.token||admin?.accessToken||admin?.jwtToken||null;
  }catch{return null;}
}
async function read(response){
  const text=await response.text();
  let data=null;
  if(text){try{data=JSON.parse(text);}catch{data=text;}}
  if(!response.ok){
    if(response.status===401) throw new Error("Token หมดอายุ กรุณาเข้าสู่ระบบใหม่");
    if(response.status===403) throw new Error(data?.message||"คุณไม่มีสิทธิ์ใช้งานส่วนนี้");
    if(response.status===404) throw new Error(data?.message||"ไม่พบข้อมูล");
    if(response.status===409) throw new Error(data?.message||"ข้อมูลซ้ำหรือถูกใช้งานอยู่");
    throw new Error(data?.message||data?.title||(typeof data==="string"?data:"")||`เกิดข้อผิดพลาด (${response.status})`);
  }
  return data;
}
async function request(url,options={}){
  const accessToken=token();
  if(!accessToken) throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
  const hasBody=options.body!==undefined&&options.body!==null;
  const response=await fetch(url,{
    ...options,
    headers:{
      Accept:"application/json",
      Authorization:`Bearer ${accessToken}`,
      ...(hasBody?{"Content-Type":"application/json"}:{}),
      ...(options.headers||{})
    },
    cache:"no-store"
  });
  return read(response);
}

export const getReliefCategories=(signal)=>request(`${API_URL}/relief-categories`,{method:"GET",signal});
export const createReliefCategory=(payload)=>request(`${API_URL}/relief-categories`,{method:"POST",body:JSON.stringify(payload)});
export const updateReliefCategory=(id,payload)=>request(`${API_URL}/relief-categories/${encodeURIComponent(id)}`,{method:"PUT",body:JSON.stringify(payload)});
export const updateReliefCategoryStatus=(id,isActive)=>request(`${API_URL}/relief-categories/${encodeURIComponent(id)}/status`,{method:"PUT",body:JSON.stringify({isActive})});
