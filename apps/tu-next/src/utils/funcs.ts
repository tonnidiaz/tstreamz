
import * as cheerio from "cheerio"

export async function parseMetadata(html: string){
    const $ = cheerio.load(html)
        const title = $("title").text()
        return {title}
}