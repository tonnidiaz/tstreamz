import { tmdbUrl, tapiKey } from "../../utils/constants";
import { getData } from "../../utils/functions";

const getTopShows = async (page: number) => {
    const url = tmdbUrl + `tv/top_rated?page=${page}&api_key=` + tapiKey;
    return await getData(url, true);
  }; 
  const getPopularShows = async (page: number) => {
    const url = tmdbUrl + `tv/popular?page=${page}&api_key=` + tapiKey;
    return await getData(url, true);
   
  }; 
  const getTrendingShows = async (page: number) => {
    const url = tmdbUrl + `trending/tv/week?page=${page}&api_key=` + tapiKey;
    return await getData(url, true);
   
  }; 
  
  const getShows = async () => {
   
      const url =`https://api.themoviedb.org/3/tv/popular?api_key=${tapiKey}&language=en-US&page=1`
      return await getData(url, true)
    
  };

  export default defineEventHandler(async e=>{
    const { t, page} : { t: string, page: number} = getQuery(e);
    
    const p = page ?? Math.floor(Math.random() * 5) + 1;
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
    
        return {data}
      } else {
        throw createError({
            statusCode: 401,
            data: {msg: "Bad request"}
        })
      }
  })