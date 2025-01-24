import axios from "axios";
import * as cheerio from "cheerio";
import type { IVideo, IVideoSide } from "../interfaces";
import { handleErrs, timedLog } from "@cmn/utils/funcs";
import { TuVid } from "./models";

const getPageVideos = async (page: number, side: IVideoSide) => {
    try {
        page += 1;
        const url = `https://watchwrestling.ec/wwe-${side}/page/${page}`;
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);

        // Select all videos [<a></a>]
        const videos = $("a.clip-link");
        const titles = $(".entry-title");
        // console.log("\n", { page, videos: videos.length });
        const data = [...videos].map((el, i) => {
            const url = $(el).attr("href") || "";
            const img = $("img", el).attr("src") || "";
            return { title: $(titles[i]).text(), url, thumb: img };
        });

        return data;
    } catch (err) {
        console.log("Failed to get page videos");
        handleErrs(err)
        return [];
    }
};

const getStremingSiteLinks = async (url: string) => {
    try {
        const { data: html } = await axios.get(url);
        const _$ = cheerio.load(html);
        const script = [..._$("script")].find((el) =>
            _$(el).text().toLowerCase().includes("episoderepeater")
        );
        const dt =
            _$(script).text().split(`append("`).pop()!.split("</textarea>")[0] +
            "</textarea>";
        const _html = _$(dt).text();
        const $ = cheerio.load(_html);
        const links = $(".episodeRepeater");
        // console.log(dt);
        // console.log("\n", links.length);
        const dailyMotionLinksCont = [...links].find((el) =>
            $(el).text().toLowerCase().includes("dailymotion")
        );
        const dailyMotionLinks = $(
            "a.responsive_custom_btn",
            dailyMotionLinksCont
        );

        const finalData: { label: string; url: string }[] = [];
        for (let link of dailyMotionLinks) {
            const $link = $(link);
            const txt = $link.text();
            const href = $link.attr("href");
            if (!txt || !href) continue;

            const { data: html } = await axios.get(href);
            const $$ = cheerio.load(html);

            const embedUrl = $$("#show_adv_wrap iframe").attr("src");
            if (!embedUrl) continue;

            finalData.push({ label: txt, url: embedUrl });
        }
        return finalData;
    } catch (err) {
        console.log("Failed to get page videos",);
        handleErrs(err)
        return [];
    }
};

export const videsScraper = async ({
    side,
    maxPages = 2,
    vidsPerPage
}: {
    side: IVideoSide;
    maxPages?: number;
    vidsPerPage?: number
}) => {
    /**
     * # Stepts
     * - Visit url1 [https://watchwrestling.ec/wwe-raw/page/1]
     *      - Get all page video links [a.clip-link]
     *          - url = [href], thumbnail = [a img.src]
     *          - Go to [url]
     *              - Get dailymotion links
     *                  - Go to each link and get video url
     */
    timedLog(`\nBEGIN VIDEO SCRAPER FOR ${side.toUpperCase()}`, {maxPages, vidsPerPage});
    // const finalVidoes: IVideo[] = []
    const log = (...args: any)=>{
        timedLog(`[${side || ''}]`, ...args)
    }
    // Save old videos to be cleared once all is good
    const oldVideos = (await TuVid.find({side}).exec()).map(el=> el.id)
    for (let page = 0; page < maxPages; page++) {
        console.log(`\n[${side || ''}] SCRAPING PAGE ${page + 1}`);
        const vids = await getPageVideos(page, side);
        for (let it of vids.slice(0, vidsPerPage)) {
            const links = await getStremingSiteLinks(it.url);
            let _title = it.title.split("–")[0].trim();
            log({title: _title})
            const splitTitle = _title.split(" ")

            let date = splitTitle.pop() || "0"

            const v: IVideo = { title: splitTitle.join(" ").trim().replaceAll("Adfree", ""), side, thumb: it.thumb, links, date };
            const tuVid = new TuVid({ ...v });
            await tuVid.save();
            // console.log(tuVid.side);
            // finalVidoes.push(v)
            // console.log("\n", links);
        }
    }

    // Delete the old videos
    for (let vidId of oldVideos){
        await TuVid.findByIdAndDelete(vidId)
    }
    timedLog("VIDEO SCRAPER FINISHED");
    return await TuVid.countDocuments();
};
