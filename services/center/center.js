import { API_URL } from "@/services/config";

import {
    readApiResponse
} from "@/services/apiHelper/apiHelper";



export async function getCenters() {
    const response = await fetch(
        `${API_URL}/centers`,
        {
            method:"GET",
            headers:{
                Accept:"application/json"
            },
            cache:"no-store"
        }
    );
    return readApiResponse(response);

}