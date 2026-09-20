import axios from "axios";

const API_URL =
    "https://api.nriis.go.th/service/service/OpenData/v1/DataSet/Project_WaterManagement";

export async function fetchWaterProjects() {
    try {
        const response = await axios.get(API_URL);

        console.log("NRIIS API RESPONSE", response.data);

        return response.data;
    } catch (error) {
        console.error("API ERROR", error);

        throw error;
    }
}
