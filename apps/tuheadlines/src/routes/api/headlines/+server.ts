import { dev } from "$app/environment";
import { dummyHeadlines } from "@/lib/constants";
import { newsApi } from "@/lib/server/models/api.js";
import { Headline } from "@/lib/server/models/index.js";
import { handleErrs, parseDate } from "@cmn/utils/funcs.js";
import { tuErr } from "@repo/ui-sv/lib/funcs";
import { json } from "@sveltejs/kit";
import axios from "axios";

export const GET = async ({}) => {
    
    const now = new Date();
    // Check if the existing headlines are today's headlines
    const _headlines = await Headline.findOne({}).exec();
    if (
        _headlines && parseDate(_headlines?.createdAt).split(" ")[0] ==
        parseDate(now).split(" ")[0]
    ) {
        // Return the headlines coz they were synced
        console.log("Headline synced");
    } else {
        // Delete all headlines in db
        // Fetch new headlines and store to db
        if (!dev){
            await Headline.deleteMany({}).exec();
        console.log("Old headlines deleted");
        try {
            const r = false ? dummyHeadlines.data  : (await newsApi.get("/topic-headlines")).data.data
            for (let n of r) {
                if (!n.title || !n.link) continue;
                const headlines = new Headline({
                    title: n.title,
                    snippet: n.snippet,
                    photo_url: n.photo_url,
                    link: n.link,
                    published_at: n.published_datetime_utc,
                });
                await headlines.save();
            }
        } catch (err) {
            handleErrs(err);
            return tuErr(500, "Failed to fetch headlines");
        }    
        }
        
    }

    const headlines = await Headline.find({}).exec();
    return json(headlines.map((el) => el.toJSON()));
};
