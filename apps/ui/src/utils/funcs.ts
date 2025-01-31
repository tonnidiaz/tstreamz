
import axios, { AxiosInstance } from "axios";
import { STORAGE_KEYS } from "./consts";

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


export const logout = (red?: string, setUser?: (val: any)=> any) => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.authTkn);
    location.href = red || "/";
};

export const showToast = ({msg, err, timeout = 3000} : {err?: boolean; msg: string; timeout?: number}) =>{
    let div = document.createElement("div");
    
    div.classList.add("alert", `alert-${err ? 'error' : 'success' }`, err && 'bg-red-500', 'text-white', !err && "bg-success" )
    div.innerHTML = `<span>${msg}</span>`
    let parent = document.getElementById("tu-toasts")
    if (!parent){
        parent = document.createElement("div")
        parent.id = "tu-toasts"
        parent.classList.add("toast", "toast-top", "toast-end")
        document.body.appendChild(parent)
    }
    parent.prepend(div);

    setTimeout(()=> div.remove(), timeout)
}

export  const scrollToTheTop = () => {
    const _top = document.querySelector(".the-top");
    _top?.scrollIntoView({ behavior: "smooth" });
};