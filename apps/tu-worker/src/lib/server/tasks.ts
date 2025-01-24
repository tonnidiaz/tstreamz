import { wweVideoScraper } from "@cmn/utils/tu-wwe/scraper"

export async function scrapeWWEVideos() {
    const res = await wweVideoScraper({side: "all", maxPages: 7})
    return true
 }
 