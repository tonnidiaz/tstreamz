import axios from "axios";

export const api = axios.create({baseURL: ""})
export const localApi = axios.create({baseURL: "/api"})