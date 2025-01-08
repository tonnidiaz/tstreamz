import axios from "axios";
import { API_URL, BEND_URL } from "./constants";
import { STORAGE_KEYS } from "@repo/ui/lib/consts";
console.log({API_URL})

export const api = axios.create({
    baseURL: BEND_URL,
    headers: {
        
        "Content-Type": "application/json",
    },
});
api.interceptors.request.use((config) => {
    config.data = config.data || {};
    config.headers.Authorization = typeof localStorage == "undefined" ? undefined : `Bearer ${localStorage.getItem(STORAGE_KEYS.authTkn)}`
    return config;
});
export const localApi = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
localApi.interceptors.request.use((config) => {
    config.data = config.data || {};
    config.headers.Authorization = typeof localStorage == "undefined" ? undefined : `Bearer ${localStorage.getItem(STORAGE_KEYS.authTkn)}`

    return config;
});
