import { scrapePastPapers } from "@/lib/server/scraper"
import { json } from "@sveltejs/kit"

export const GET = async () =>{
    const length = await scrapePastPapers()
    return json({msg: "Past papers updated", length})
}