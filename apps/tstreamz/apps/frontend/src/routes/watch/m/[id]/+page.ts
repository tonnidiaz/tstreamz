import { localApi } from "@/lib/api";
import { offline } from "@/lib/constants";
import { dummyMovie } from "@/lib/consts2.js";
import { handleErrs } from "@cmn/utils/funcs";
import { error } from "@sveltejs/kit";
import { AxiosError } from "axios";
export const load = async ({params, url}) =>{
    try {
        
        const root = url.origin
        const {id} = params
        if (offline) return {movie: dummyMovie}
         const r = await localApi.get(root + "/api/watch/m/" + id);
         return {movie: r.data.movie}
    } catch (err) {
        console.log("Get movie error")
        handleErrs(err)
        let status: number | undefined;
        let msg: string | undefined;
        if (err instanceof AxiosError){
            
            status = err.status
            msg = err.response.data
            // console.log("isAxiosErr", {status, msg});
        }
        error(status || 500, msg || "Something went wrong")
    }
}