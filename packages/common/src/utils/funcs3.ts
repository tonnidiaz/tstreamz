import { AxiosInstance } from "axios";

type TA = AxiosInstance

export const requestOTP = async ({
    user,
    newEmail,
    action,
    api
}: {
    user: string;
    newEmail?: string;
    action?: string; 
    api: TA
}) => {
    const res = await api.post("/auth/otp/request", {
        user,
        newEmail,
    }, {params: {action}});
    return res;
};
export const verifyOTP = async ({
    user,
    newEmail,
    value,
    api
}: {
    user: string;
    newEmail?: string;
    value: string;
    api: TA
}) => {
    const res = await api.post("/auth/otp/verify", {
        user,
        value,
        newEmail,
    });
    return res.data;
};
