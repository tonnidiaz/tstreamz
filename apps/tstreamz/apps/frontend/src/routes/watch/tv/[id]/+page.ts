import { localApi } from "@/lib/api";
import { handleErrs } from "@cmn/utils/funcs";
import { error } from "@sveltejs/kit";
import { AxiosError } from "axios";

export const load = async ({params, url}) =>{
    try {
        
        const root = url.origin
        const {id} = params
         const r = await localApi.get(root + "/api/watch/tv/" + id);
         return r.data
    } catch (err) {
        handleErrs(err)
        let status: number | undefined;
        let msg: string | undefined;
        if (err instanceof AxiosError){
            status = err.status
            msg = err.message
        }
        error(status || 500, msg || "Something went wrong")
    }
}