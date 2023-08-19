import { tapiKey, tmdbUrl } from "../../utils/constants";
import { getData } from "../../utils/functions";

const getTopMovies = async (page: number) => {
    const url = tmdbUrl + `movie/top_rated?page=${page}&api_key=` + tapiKey;
    return await getData(url, true);
  };  
  const getPopularMovies = async (page: number) => {
    const url = tmdbUrl + `movie/popular?page=${page}&api_key=` + tapiKey;
    return await getData(url, true);
   
  }; 
  const getTrendingMovies = async (page: number) => {
    const url = tmdbUrl + `trending/movie/week?page=${page}&api_key=` + tapiKey;
    return await getData(url, true);
   
  }; 
  
  const getMovies = async () => {
   
      const url =`https://api.themoviedb.org/3/movie/popular?api_key=${tapiKey}&language=en-US&page=1`
      return await getData(url, true)
    
  };

  export default defineEventHandler(async (e)=>{
    const { t, page} : { t: string, page: number} = getQuery(e);
    
    const p = page ?? Math.floor(Math.random() * 5) + 1;
    if (t) {
        let data;
        switch (t) {
          case "top":
            data = await getTopMovies(p);
            break;
          case "popular":
            data = await getPopularMovies(p);
            break;
          case "latest":
            data = await getTrendingMovies(p);
            break;
    
          default:
            data = await getMovies();
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