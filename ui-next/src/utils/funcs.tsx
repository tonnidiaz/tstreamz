import TuToast from "../components/TuToast";
import { ToastType } from "./interfaces";
import ReactDOM from "react-dom/client";

export const showToast = (msg: string, type?: ToastType, duration = 2500)=>{
    let parent = document.querySelector("#tu-toasts")
    if (!parent){
        parent = document.createElement("div")
        parent.id = "tu-toasts";
        document.body.appendChild(parent)
    }else{
    }

    const toastParent = document.createElement("div")
    toastParent.classList.add("tu-toast")
    parent.appendChild(toastParent)
    ReactDOM.createRoot(toastParent).render(<TuToast msg={msg} type={type}/> )
    setTimeout(()=>{
        toastParent.remove()
    }, duration)
    
}