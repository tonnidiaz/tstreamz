import axios from "axios";
import { tmdbUrl, tapiKey } from "../../../../utils/constants";
import { getTrailer } from "../../../../utils/functions";



export default defineEventHandler(async e =>{
    const { id } = getRouterParams(e)
    const data = await getTrailer(id, true);
  return { trailer: data };
})