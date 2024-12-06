import { offline, tmdbUrl } from "@/lib/constants";
import { dummyShows } from "@/lib/consts2.js";
import { tapiKey } from "@/lib/server/constants";
import { getMovieData } from "@/lib/server/funcs";
import { error, json } from "@sveltejs/kit";

const getTopShows = async (page: number) => {
    const url = tmdbUrl + `tv/top_rated?page=${page}&api_key=` + tapiKey;
    return offline ? dummyShows.topRated : await getMovieData(url, true);
  }; 
  const getPopularShows = async (page: number) => {
    const url = tmdbUrl + `tv/popular?page=${page}&api_key=` + tapiKey;
    return offline ? dummyShows.popular : await getMovieData(url, true);
   
  }; 
  const getTrendingShows = async (page: number) => {
    const url = tmdbUrl + `trending/tv/week?page=${page}&api_key=` + tapiKey;
    return offline ? dummyShows.trending : await getMovieData(url, true);
   
  }; 
  
  const getShows = async () => {
   
      const url =`https://api.themoviedb.org/3/tv/popular?api_key=${tapiKey}&language=en-US&page=1`
      return await getMovieData(url, true)
    
  };

  export const GET = async ({url})=>{
    const { t, page}  = Object.fromEntries(url.searchParams);
    
    const p = page ? Number(page) : Math.floor(Math.random() * 5) + 1;
    if (t) {
        let data;
        switch (t) {
          case "top":
            data = await getTopShows(p);
            break;
          case "popular":
            data = await getPopularShows(p);
            break;
          case "latest":
            data = await getTrendingShows(p);
            break;
    
          default:
            data = await getShows();
            break;
        }
    
        return json({data})
      } else {
        error(401, "Bad request")
      }
  }