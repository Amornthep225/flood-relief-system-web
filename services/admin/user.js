import { API_URL } from "../config";

async function parseResponse(res) {
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
        throw new Error(data.message || "ทำรายการไม่สำเร็จ");
    }

    return data;
}

export async function getUsers() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return parseResponse(res);
}

export async function getUserById(id) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return parseResponse(res);
}

export async function updateUser(id, payload) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    return parseResponse(res);
}

export async function updateUserStatus(id, isActive) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/users/${id}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
    });

    return parseResponse(res);
}
