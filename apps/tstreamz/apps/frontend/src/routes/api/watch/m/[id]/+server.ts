import { tapiKey } from "@/lib/server/constants";
import { handleErrs } from "@cmn/utils/funcs";
import { error, json } from "@sveltejs/kit";
import axios from "axios";

const getMovie = async (v: any) => {
    //return movie;
    const url = `https://api.themoviedb.org/3/movie/${v}?api_key=${tapiKey}&language=en-US`;
    try {
        let res = await axios.get(url);
        let { data } = res;
        //data.frame = await getFrameUrl(data.id)
        return data;
    } catch (error: any) {
        handleErrs(error);
        let status = error?.response?.status || 500;
        return status
    }
};

export const GET = async ({ params }) => {
    const { id } = params;
    console.log({id});
    let data = await getMovie(id);
    if (typeof data !== 'number') {
        return json({ movie: data });
    } else {
        error(data, "Could not get movie");
    }
};
