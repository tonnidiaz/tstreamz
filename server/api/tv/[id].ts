import axios from "axios";
import { tapiKey } from "../../../utils/constants";

const getEps = async (id: any, sNum: any) => {
    //return eps
    const url = `https://api.themoviedb.org/3/tv/${id}/season/${sNum}?api_key=${tapiKey}&language=en-US`;
    let res = await axios.get(url);
    return res.data;
};

export default defineEventHandler(async (e) => {
    const { id } = getRouterParams(e);
    const { s, ep } = getQuery(e);
    const data = await getEps(id, s);
    return { data };
});
