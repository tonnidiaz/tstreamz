import axios from 'axios'
import { imgUrl, tapiKey, tmdbUrl } from './constants'

const getData = async (url, isShow) => {
    let res = await axios.get(url)
    const {results} = await res.data
    results.map(async r=>{
        if (false){
            const url = `https://2embed.org/embed/series?tmdb=${r.id}`
            console.log(url);
            const res = await axios.get(url)
            console.log(res.data);
        }
        r.image = imgUrl + r.poster_path
        return r
    })
    

    return results.filter(it => parseFloat(it.vote_average) > 0)
}

const getImdbId = async (id) => {
    const url = tmdbUrl + `movie/${id}/external_ids?api_key=` + tapiKey

    try {
    let res = await axios.get(url)
    const {imdb_id} = await res.data
    return imdb_id
    } catch (error) {
        console.log(error);
    }
    
}

const getCredits = async (id, tv) =>{

    let t = tv ? 'tv' : 'movie'
    const url = `https://api.themoviedb.org/3/${t}/${id}/credits?api_key=${tapiKey}&language=en-US`
    const res = await axios.get(url)
    return res.data
}

const getSimilar= async (id, tv) =>{
    let t = tv ? 'tv' : 'movie'
    const url = `https://api.themoviedb.org/3/${t}/${id}/similar?api_key=${tapiKey}&language=en-US`
    const res = await axios.get(url)
    
    return res.data.results
}
const getMeta = async (id, tv) =>{

    let data = {}
    const credits = await getCredits(id, tv)
    const similar = await getSimilar(id, tv)
    data.credits = credits
    data.similar = similar

    return data
}

const rand = (min,max) =>{
    return Math.floor(Math.random() * max) + min;
}
export {getData, getMeta, rand}