import type { IObj } from "@cmn/utils/interfaces";

export const appStore = $state({
    ready: false,
    cnt: 0,
    genres: null as {movies: IObj[]; shows: IObj[]},
    watchlist: null as any,
    trailerId: null as string | null,
    trailerErr: null as string | null,
});

export const setReady = (v: typeof appStore.ready) =>
    (appStore.ready = v);
export const setGenres = (v: typeof appStore.genres) =>
    (appStore.genres = v);
export const setWatchlist = (v: typeof appStore.watchlist) =>
    (appStore.watchlist = v);
export const setTrailerId = (v: typeof appStore.trailerId) =>
    (appStore.trailerId = v);
export const setTrailerErr = (v: typeof appStore.trailerErr) =>
    (appStore.trailerErr = v);

