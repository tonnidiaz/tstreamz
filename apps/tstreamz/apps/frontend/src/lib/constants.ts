import { dev } from "$app/environment";

export const SITE = "Tunedstreamz", email ="tunedstreamz@gmail.com";
const __DEV__ = dev // typeof window == "undefined" || window.location.origin.includes("localhost")
export const ROOT = __DEV__
    ? "http://localhost:3000"
    : "https://tstreamz-sv.vercel.app";
const heroku = false,
    koyeb = true;
export const BEND_URL = __DEV__
    ? "http://localhost:8000"
    : heroku
      ? "https://tu-trader-3996d65ded90.herokuapp.com"
      : koyeb
        ? "https://tu-trader.koyeb.app"
        : "https://tu-trader-mef0.onrender.com";
export const API_URL = "/api";

export const STORAGE_KEYS = { authTkn: "TB_AUTH_TOKEN" };
export const SITE_SLOGAN = "A free movie & series streaming site";
export const DEVELOPER = "Tonni Diaz"


export const siteDesc = 'Watch all your favorite Movies And TV Shows in HD. Live update'
export const company = 'TUNEDBASS'
export const year = new Date().getFullYear()
export const imgUrl = "https://image.tmdb.org/t/p/w500"
export const tmdbUrl = "https://api.themoviedb.org/3/"
export const offline = false
export const showFrame = true