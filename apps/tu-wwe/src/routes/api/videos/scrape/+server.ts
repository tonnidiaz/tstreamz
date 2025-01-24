import { TuVid } from "@/lib/server/models/index.js";
import { videsScraper } from "@/lib/server/scraper.js";
import { clearTerminal } from "@cmn/utils/funcs";
import { json } from "@sveltejs/kit";

export const GET = async ({ url }) => {
    clearTerminal()
    const { side, max, perPage } = Object.fromEntries(url.searchParams);

    const maxPages = Number(max || 0) || undefined, vidsPerPage = Number(perPage || 0) || undefined

    if (!side || side == "all" || side == "raw")
        // Scrape Raw videos
        await videsScraper({ side: "raw", maxPages,vidsPerPage });
    if (!side || side == "all" || side == "smackdown")
        // Scrape smackdown videos
        await videsScraper({ side: "smackdown", maxPages,vidsPerPage });

    return json({msg: "Ok", videos: await TuVid.countDocuments()})
};
