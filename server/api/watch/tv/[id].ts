import axios from "axios";
import { tapiKey } from "../../../../utils/constants";

const getTv= async (id: string) => {
    //return movie;
    const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${tapiKey}`;
    try {
      let res = await axios.get(url);
      let { data } = res;
      return data;
    } catch (error: any) {
      console.log(error);
      let status = error?.response?.status;
      if (status == 404) {
      return 404
       
      } 
    }
  };

export default defineEventHandler(async e=>{
    const {id} = getRouterParams(e)
    let data = await getTv(id)
    if (data !== 404){
     return {tv : data}
    }
    else{
        throw createError({
            statusCode: 404, 
            data: {msg :"Tv show not found", status: 404}
        })
    }
})