import axios from "axios";
import { tapiKey } from "../../../../utils/constants";

const getMovie = async (v: any) => {
    //return movie;
    const url = `https://api.themoviedb.org/3/movie/${v}?api_key=${tapiKey}&language=en-US`;
    try {
      let res = await axios.get(url); 
      let { data } = res;
          //data.frame = await getFrameUrl(data.id)
      return data;
    } catch (error: any) {
      console.log(error);
      let status = error?.response?.status;
      if (status == 404) {
        //res.status(404).json({ msg: "Movie not found" });
        return 404;
      }
    }
  };

export default defineEventHandler(async e=>{
    const {id} = getRouterParams(e)
    let data = await getMovie(id)
    if (data !== 404){
     return {movie : data}
    }
    else{
        throw createError({
            statusCode: 404, 
            data: {msg :"Movie not found", status: 404}
        })
    }
})