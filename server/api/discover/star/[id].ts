import axios from "axios"
import { tapiKey, tmdbUrl } from "../../../../utils/constants"

const getByStar = async (star: string) => {
    const url = tmdbUrl + `discover/movie?api_key=${tapiKey}&with_cast=${star}`
    const personUrl = tmdbUrl + `person/${star}?api_key=${tapiKey}`
    try {
        const { data } = await axios.get(url)
        const res3 = await axios.get(personUrl)
        const person =  res3.data

        return {
            movies: data.results,
            star: person
        }
    } catch (err) {
        console.log(err);
        return 'err'
    }
}

export default defineEventHandler(async e=>{
    const { id } = getRouterParams(e)
    const data = await getByStar(id)
    return {data}
})