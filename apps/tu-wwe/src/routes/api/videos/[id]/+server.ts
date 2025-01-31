import { tuErr } from '@repo/ui-sv/lib/funcs.js'
import { json } from '@sveltejs/kit'

export const GET = async({params})=>{
    const {TuVid} = await import("@cmn/utils/tu-wwe/models")
    const vid = await TuVid.findById(params.id)
    if (!vid) return tuErr(404, "Content not found")
    return json(vid.toJSON())
}