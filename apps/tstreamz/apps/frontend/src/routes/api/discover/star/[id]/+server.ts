import axios from "axios"
import { error, json } from "@sveltejs/kit"
import { tmdbUrl } from "@/lib/constants"
import { tapiKey } from "@/lib/server/constants"

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
        
    }
}

export const GET = async ({params})=>{
    const { id } = params
    const data = await getByStar(id)
    return data ? json(data) : error(500, "Could not get start")
}