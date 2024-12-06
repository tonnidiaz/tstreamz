import axios from "axios";
import { error, json } from "@sveltejs/kit";
import { tmdbUrl } from "@/lib/constants";
import { tapiKey } from "@/lib/server/constants";

const getMGenres = async () => {
    try{
        const url = tmdbUrl + "genre/movie/list?api_key=" + tapiKey;
    const res = await axios.get(url);
    const { genres } = res.data;
    return genres;}
    catch(e){
        console.log(e)
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
        console.log(e)
        return []
    }
  };
const getGenres = async () => {
    const movies = await getMGenres();
    const shows = await getSGenres();
    return { shows, movies };
  };  

  
export const GET = async()=>{
    const genres = await getGenres();
    
    return  genres ? json({ genres }) : error(500, "Could not get genres")
}