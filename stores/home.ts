import { defineStore } from "pinia";

export const useHomeStore = defineStore("home", {
    state: ()=>({
        popularShows : null as Array<any> | null,
        topShows: null as Array<any> | null,
        popularMovies : null as Array<any> | null,
        topMovies: null as Array<any> | null,
    }),
    actions: {
        setPopularShows (val: Array<any>) {
            this.popularShows = val
        },
        setTopShows (val: Array<any>) { 
            this.topShows = val
        },
        setPopularMovies (val: Array<any>) {
            this.popularMovies = val
        },
        setTopMovies (val: Array<any>) {
            this.topMovies = val
        }
    }
})