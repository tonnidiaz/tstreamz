import type { IObj } from "@cmn/utils/interfaces";

export const homeStore = $state({
    popularShows: null as IObj[] | null,
    topShows: null as IObj[] | null,
    popularMovies: null as IObj[] | null,
    topMovies: null as IObj[] | null,
});

export const setPopularShows = (v: typeof homeStore.popularShows) =>
    (homeStore.popularShows = v);
export const settopShows = (v: typeof homeStore.topShows) =>
    (homeStore.topShows = v);

export const setTopularMovies = (v: typeof homeStore.popularMovies) =>
    (homeStore.popularMovies = v);
export const setTopMovies = (v: typeof homeStore.topMovies) =>
    (homeStore.topMovies = v);
