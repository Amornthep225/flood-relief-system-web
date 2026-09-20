"use client";

import { useEffect, useState } from "react";
import { fetchWaterProjects } from "../services/waterApi";

export default function useWaterProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWaterProjects()
            .then((res) => {
                console.log("DATA", res);

                let data = [];

                // รองรับ structure ของ API
                if (Array.isArray(res)) {
                    data = res;
                }
                else if (Array.isArray(res.data)) {
                    data = res.data;
                }
                else if (res.result?.records) {
                    data = res.result.records;
                }
                else if (res.result) {
                    data = res.result;
                }

                console.log("PROJECT LIST", data);

                setProjects(data);
            })

            .catch((err) => {
                console.error(err);
                setError(err);
            })

            .finally(() => {
                setLoading(false);
            });
    }, []);

    return {
        projects,
        loading,
        error,
    };
}
