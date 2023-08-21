import axios from "axios";
import { tapiKey, tmdbUrl } from "../../../../utils/constants";

const getData = async (id : string, page : number, isShow : any) => {
    const t = isShow ? 'tv' : 'movie'
    const url = tmdbUrl + `discover/${t}?api_key=${tapiKey}&with_genres=${id}&page=${page}`;
      
    try {
      const { data } = await axios.get(url);
      return data.results
    } catch (err) {
      console.log(err);
      throw err
    }
  };

  export default defineEventHandler(async e=>{
    const { id } = getRouterParams(e)
    const { page, isShow} = getQuery(e)
    const data = await getData(id, page as number, isShow)
    return { data }
  })