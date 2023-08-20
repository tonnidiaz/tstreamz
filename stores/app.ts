import { defineStore } from "pinia";

type Genre =  {[key: string] : Array<any>}
type Genres = {[key: string] : Genre}

export const useAppStore = defineStore("app", {
    state: ()=> ({
        genres: null as any,
        user: null as  any,
        ready: false,
        watchlist: null as any,
        trailerId: null as string | null,
        trailerErr: null as string | null,
    }),
    actions: {
        setUser(val: any){
            this.user = val;
        },

        setGenres(val: any){
            this.genres = val;
        },
        setWatchlist(val: any) {
            this.watchlist = { shows: val.shows, movies: val.movies};
          },
          setReady(val: any) {
            this.ready = val; 
          },
          setTrailerId(val: any) {
            this.trailerId = val;
          },
          setTrailerErr(val: any) {
            this.trailerErr = val;
          },
    }
})