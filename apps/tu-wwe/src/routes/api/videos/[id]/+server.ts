import { TuVid } from '@cmn/utils/tu-wwe/models'
import { tuErr } from '@repo/ui/lib/funcs.js'
import { json } from '@sveltejs/kit'

export const GET = async({params})=>{
    const vid = await TuVid.findById(params.id)
    if (!vid) return tuErr(404, "Content not found")
    return json(vid.toJSON())
}