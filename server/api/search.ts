import axios from "axios";
import { tmdbUrl, tapiKey } from "../../utils/constants";

const search = async (q : string) => {
    const movies = await searchMovie(q);
    const shows = await searchShow(q);
    let data = {
      shows,
      movies,
    };
  
    return data;
  };
const searchMovie = async (q : string) => {
    try {
      const url = `${tmdbUrl}search/movie?query=${q}&api_key=${tapiKey}&include_adult=true&page=1`;
      const res = await axios.get(url);
      return res.data.results.filter((it : any) => parseFloat(it.vote_average) > 0);
    } catch (error) {
      console.log(error);
      return []
    } 
  };
  const searchShow = async (q : string) => {
    try {
      const url = `${tmdbUrl}search/tv?query=${q}&api_key=${tapiKey}&include_adult=true&page=1`;
      const res = await axios.get(url);
      return res.data.results.filter((it : any) => parseFloat(it.vote_average) > 0);
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  export default defineEventHandler(async e=>{
    const { q } = getQuery(e)
    const data = await search(`${q}`);
    return {data}
  })
   