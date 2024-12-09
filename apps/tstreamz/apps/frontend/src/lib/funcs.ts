import { setUser } from "@/stores/user.svelte";
import { localApi } from "./api";
import { STORAGE_KEYS } from "./constants";

export function preventScroll(e: any) {
    e.preventDefault();
}

export const requestOTP = async ({
    user,
    newEmail,
}: {
    user: string;
    newEmail?: string;
}) => {
    const res = await localApi.post("/auth/otp/request", {
        user,
        newEmail,
    });
    return res;
};
export const verifyOTP = async ({
    user,
    newEmail,
    value,
}: {
    user: string;
    newEmail?: string;
    value: string;
}) => {
    const res = await localApi.post("/auth/otp/verify", {
        user,
        value,
        newEmail,
    });
    return res.data;
};

export const logout = (red?: string) => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.authTkn);
    location.href = red || "/";
};
