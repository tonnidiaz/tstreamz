import { clearTerminal } from "@cmn/utils/funcs";
import { TuVid } from "@cmn/utils/tu-wwe/models";
import { wweVideoScraper } from "@cmn/utils/tu-wwe/scraper";
import { json } from "@sveltejs/kit";

export const GET = async ({ url }) => {
    clearTerminal()
    const { side, max, perPage } = Object.fromEntries(url.searchParams);

    const maxPages = Number(max || 0) || undefined, vidsPerPage = Number(perPage || 0) || undefined

    if (!side || side == "all" || side == "raw")
        // Scrape Raw videos
        await wweVideoScraper({ side: "raw", maxPages,vidsPerPage });
    if (!side || side == "all" || side == "smackdown")
        // Scrape smackdown videos
        await wweVideoScraper({ side: "smackdown", maxPages,vidsPerPage });

    return json({msg: "Ok", videos: await TuVid.countDocuments()})
};
