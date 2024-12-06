import type { IObj } from "@cmn/utils/interfaces";

export const userStore = $state({
    user: null as  IObj | null,
    watchlist: null as {
        shows: IObj[]; movies: IObj[]
    } | null,
})

export const setUser = (v: typeof userStore.user) =>
    (userStore.user = v);
export const setWatchlist = (v: typeof userStore.watchlist) =>
    (userStore.watchlist = v);
