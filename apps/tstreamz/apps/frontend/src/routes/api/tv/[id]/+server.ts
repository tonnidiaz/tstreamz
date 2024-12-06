import axios from "axios";
import { error, json } from "@sveltejs/kit";
import { tapiKey } from "@/lib/server/constants";
import { handleErrs } from "@cmn/utils/funcs";
import { offline } from "@/lib/constants.js";
import { dummyEps } from "@/lib/consts2.js";

const getEps = async (id: any, sNum: any) => {
    //return eps
    try{
        const url = `https://api.themoviedb.org/3/tv/${id}/season/${sNum}?api_key=${tapiKey}&language=en-US`;
    let res = await axios.get(url);
   
    return res.data;
    }
    catch(err){
        handleErrs(err)
    }
};

export const GET = async ({params, url}) => {
    const { id } = params;
    const { s, ep } = Object.fromEntries(url.searchParams);
    const data = offline ? dummyEps : await getEps(id, s);
    if (data) return json(data)
    error(500, "Could not get tv show");
}
