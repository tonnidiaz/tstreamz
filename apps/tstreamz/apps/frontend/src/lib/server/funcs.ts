import axios from "axios";
import { imgUrl, tmdbUrl } from "../constants";
import { handleErrs } from "@cmn/utils/funcs";
import type { IObj } from "@cmn/utils/interfaces";
import { tapiKey } from "./constants";
import { error } from "@sveltejs/kit";

export const getMovieData = async (url: string, isShow: boolean) => {
    try {
        let res = await axios.get(url);
        const { results } = await res.data;
        results.map(async (r: any) => {
            if (false) {
                const url = `https://2embed.org/embed/series?tmdb=${r.id}`;
                console.log(url);
                const res = await axios.get(url);
                console.log(res.data);
            }
            r.image = imgUrl + r.poster_path;
            return r;
        });

        return results.filter((it) => parseFloat(it.vote_average) > 0);
    } catch (e) {
        handleErrs(e);
        return [];
    }
};

export const getCredits = async (id, tv) => {
    let t = tv ? "tv" : "movie";
    const url = `https://api.themoviedb.org/3/${t}/${id}/credits?api_key=${tapiKey}&language=en-US`;
    const res = await axios.get(url);
    return res.data;
};

export const getSimilar = async (id, tv) => {
    let t = tv ? "tv" : "movie";
    const url = `https://api.themoviedb.org/3/${t}/${id}/similar?api_key=${tapiKey}&language=en-US`;
    const res = await axios.get(url);

    return res.data.results;
};
export const getMeta = async (id: string, tv?: boolean) => {
    try {
        let data: IObj = {};
        const credits = await getCredits(id, tv);
        const similar = await getSimilar(id, tv);
        data.credits = credits;
        data.similar = similar;

        return data;
    } catch (err) {
        handleErrs(err);
    }
};
export const getTrailer = async (id: string, tv: boolean = false) => {
    const m = tv ? "tv" : "movie";

    const url = tmdbUrl + `${m}/${id}/videos?api_key=${tapiKey}`;
    const { data } = await axios.get(url);

    let d = data.results.filter(
        (it) => it.type === "Trailer" && it.official
    )[0];
    d = d ?? data.results.filter((it) => it.type === "Trailer")[0];

    return d;
};


export const tuErr = (status: number, msg: string) => error(status, `tu:${msg}`)