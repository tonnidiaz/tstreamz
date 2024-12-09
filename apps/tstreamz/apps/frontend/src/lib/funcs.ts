import { localApi } from "./api";

export function preventScroll(e: any) {
    e.preventDefault();
}

export const requestOTP = async ({user, newEmail}:{user: string; newEmail?: string}) =>{
    const res = await localApi.post("/auth/otp/request", {
        user,
        newEmail
    });
    return res
}