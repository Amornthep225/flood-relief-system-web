import { API_URL } from "@/services/config";
import {
    getToken,
    readApiResponse
} from "@/services/apiHelper/apiHelper";


export async function createDonation(payload){

    const token = getToken();


    const response = await fetch(
        `${API_URL}/donations`,
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json",

                Authorization:
                `Bearer ${token}`
            },

            body:JSON.stringify(payload)
        }
    );


    return readApiResponse(response);
}



export async function getMyDonations() {

    const token = getToken();


    if (!token) {
        throw new Error(
            "ไม่พบ Token กรุณาเข้าสู่ระบบใหม่"
        );
    }


    const response = await fetch(
        `${API_URL}/donations/my`,
        {
            method: "GET",

            headers:{
                Accept:"application/json",
                Authorization:`Bearer ${token}`,
            },

            cache:"no-store",
        }
    );


    return readApiResponse(response);
}
export async function getDonationById(id){

    const token = getToken();
    const response = await fetch(
        `${API_URL}/donations/${id}`,
        {
            method:"GET",

            headers:{
                Accept:"application/json",

                Authorization:
                `Bearer ${token}`
            },

            cache:"no-store"
        }
    );
    return readApiResponse(response);
}