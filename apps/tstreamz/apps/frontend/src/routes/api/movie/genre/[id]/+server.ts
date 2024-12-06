import { tmdbUrl } from "@/lib/constants";
import { tapiKey } from "@/lib/server/constants.js";
import { handleErrs } from "@cmn/utils/funcs";
import { error, json } from "@sveltejs/kit";
import axios from "axios";

const getData = async (id : string, page : number, isShow : any) => {
    const t = isShow=='true' ? 'tv' : 'movie'
    const url = tmdbUrl + `discover/${t}?api_key=${tapiKey}&with_genres=${id}&page=${page}`;
      
    try {
      const { data } = await axios.get(url);
      return data.results
    } catch (err) {
      handleErrs(err);
      
    }
  };

  export const GET = async ({params, url})=>{
    const { id } = params
    const { page, isShow} = Object.fromEntries(url.searchParams)
    const data = await getData(id, Number(page), isShow)
    return data ? json({ data }) : error(500, "Could not get genre")
  }