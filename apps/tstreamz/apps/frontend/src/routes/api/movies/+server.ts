import { offline, tmdbUrl } from "@/lib/constants";
import { dummyMovieData } from "@/lib/consts2.js";
import { tapiKey } from "@/lib/server/constants";
import { getMovieData, tuErr } from "@/lib/server/funcs";
import { json } from "@sveltejs/kit";
const getTopMovies = async (page: number) => {
    if (offline) return Object.values(dummyMovieData.topRated)
    const url = tmdbUrl + `movie/top_rated?page=${page}&api_key=` + tapiKey;
    return await getMovieData(url, true);
  };  
  const getPopularMovies = async (page: number) => {
    if (offline) return Object.values(dummyMovieData.popular)
    const url = tmdbUrl + `movie/popular?page=${page}&api_key=` + tapiKey;
    return await getMovieData(url, true);
   
  }; 
  const getTrendingMovies = async (page: number) => {
    if (offline) return Object.values(dummyMovieData.trending)
    const url = tmdbUrl + `trending/movie/week?page=${page}&api_key=` + tapiKey;
    return await getMovieData(url, true);
   
  }; 
  
  const getMovies = async () => {
   
      const url =`https://api.themoviedb.org/3/movie/popular?api_key=${tapiKey}&language=en-US&page=1`
      return await getMovieData(url, true)
    
  };

  
export const GET = async ({url}) => {
    let { t, page}  = Object.fromEntries(url.searchParams);
    console.log({tapiKey});
    const p = page ? Number(page) : Math.floor(Math.random() * 5) + 1;
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
    
        return json({data})
      } else {
        tuErr( 401,
            "Bad request"
        )
      }
}