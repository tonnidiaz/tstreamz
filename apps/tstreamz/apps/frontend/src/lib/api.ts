import { dev } from "$app/environment";
import { BEND_URL, STORAGE_KEYS, API_URL } from "./constants";
import axios from "axios";
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
    if (dev)
    console.log({Authorization: config.headers.Authorization})
    return config;
});
