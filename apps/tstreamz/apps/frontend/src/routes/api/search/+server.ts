import { offline, tmdbUrl } from "@/lib/constants";
import { dummyMovieData, dummyShows } from "@/lib/consts2.js";
import { tapiKey } from "@/lib/server/constants";
import { handleErrs } from "@cmn/utils/funcs";
import { error, json } from "@sveltejs/kit";
import axios from "axios";

const search = async (q : string) => {
    const movies = offline ? Object.values(dummyMovieData.popular) : await searchMovie(q);
    const shows = offline ? dummyShows :await searchShow(q);
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
      handleErrs(error);
      return []
    } 
  };
  const searchShow = async (q : string) => {
    try {
      const url = `${tmdbUrl}search/tv?query=${q}&api_key=${tapiKey}&include_adult=true&page=1`;
      const res = await axios.get(url);
      return res.data.results.filter((it : any) => parseFloat(it.vote_average) > 0);
    } catch (error) {
      handleErrs(error);
      return [];
    }
  };

  export const GET = async ({url})=>{
    const { q } = Object.fromEntries(url.searchParams)
    const data = await search(`${q}`);
    return data ? json({data}) : error(500, "Failed to search")
  }
   