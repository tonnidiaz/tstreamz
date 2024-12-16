import { dev } from "$app/environment"
import { Headline } from "@/lib/server/models"
import { tuErr } from "@repo/ui/lib/funcs"

export const POST = async () =>{
    if (dev){
        await Headline.deleteMany({}).exec()
        console.log('Headlines deleted');
        return new Response("Done")
    }
    else{
        tuErr(400, "Headlines can't be deleted in development mode")
    }
}