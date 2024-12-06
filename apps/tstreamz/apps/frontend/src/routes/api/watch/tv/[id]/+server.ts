import { offline } from "@/lib/constants.js";
import { dummyShow } from "@/lib/consts2.js";
import { tapiKey } from "@/lib/server/constants";
import { handleErrs } from "@cmn/utils/funcs";
import { error, json } from "@sveltejs/kit";
import axios from "axios";

const getTv= async (id: string) => {
    //return movie;
    const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${tapiKey}`;
    try {
      let res = await axios.get(url);
      let { data } = res;
      return data;
    } catch (error: any) {
        handleErrs(error);
        let status = error?.response?.status || 500;
        return status
    }
  };

export const GET = async ({params}) =>{
    const {id} = params
    let data = offline ? dummyShow : await getTv(id)
    if (typeof data !== 'number') {
        return json({ tv: data });
    } else {
        error(data, "Could not get show");
    }
}