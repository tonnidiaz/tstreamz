import axios from "axios";
import { error, json } from "@sveltejs/kit";
import { offline, tmdbUrl } from "@/lib/constants";
import { tapiKey } from "@/lib/server/constants";
import { handleErrs } from "@cmn/utils/funcs";
import { dummyGenres } from "@/lib/consts2";

const getMGenres = async () => {
    try{
        const url = tmdbUrl + "genre/movie/list?api_key=" + tapiKey;
    const res = await axios.get(url);
    const { genres } = res.data;
    return genres;}
    catch(e){
        handleErrs(e)
        return []
    }
  };
  const getSGenres = async () => {
    try{
        const url = tmdbUrl + "genre/tv/list?api_key=" + tapiKey;
    const res = await axios.get(url);
    const { genres } = res.data;
    return genres;}
    catch(e){
        handleErrs(e)
        return []
    }
  };
const getGenres = async () => {
    const movies = await getMGenres();
    const shows = await getSGenres();
    return { shows, movies };
  };  

  
export const GET = async()=>{
    // console.log({tapiKey});
    const genres = offline ? dummyGenres : await getGenres();
    
    return  genres ? json({ genres }) : error(500, "Could not get genres")
}