import { localApi } from "@/lib/api";

export const load = async ({ params, url }) => {
    const root = url.origin;
    const {data} = await localApi.get(root + "/api/discover/star/" + params.id);
    return {movies: data.movies, star: data.star};
};
