import { API_URL } from "@/services/config";

import {
    readApiResponse
}
from "@/services/apiHelper/apiHelper";



export async function uploadImage(file)
{

    const formData = new FormData();


    formData.append(
        "file",
        file
    );



    const response = await fetch(
        `${API_URL}/uploads/image`,
        {
            method:"POST",

            body:formData
        }
    );



    return readApiResponse(response);

}