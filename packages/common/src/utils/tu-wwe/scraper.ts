import axios from "axios";
import * as cheerio from "cheerio";
import { clearTerminal, handleErrs, timedLog } from "@cmn/utils/funcs";
import { IVideoSide, IVideo } from "./interfaces";
import { listPPV } from "./consts";

const BASE_URL = "https://watchwrestling.ec";
const _axios = axios;
const getPageVideos = async (page: number, side: IVideoSide) => {
    try {
        page += 1;
        const data: {
            title: string;
            url: string;
            thumb: string;
        }[] = [];

        const _fn = async (ppv?: (typeof listPPV)[number]) => {
            try {
                if (ppv) {
                    console.log(`[${page}][${ppv}]`);
                }
                const url =
                    side == "ppv"
                        ? `/wwe/page/${page}?s=${ppv.toLowerCase()}`
                        : `/wwe-${side}/page/${page}`;
                console.log({ url });

                const { data: html } = await _axios.get(BASE_URL + url);
                const $ = cheerio.load(html);

                // Select all videos [<a></a>]
                const videos = $("a.clip-link");
                const titles = $(".entry-title");
                console.log({ videos: videos.length });
                // console.log("\n", { page, videos: videos.length });
                let vids = [...videos].map((el, i) => {
                    const url = $(el).attr("href") || "";
                    const img = $("img", el).attr("src") || "";
                    return { title: $(titles[i]).text(), url, thumb: img };
                });
                const splitPPV = ppv
                    ?.split(" ")
                    .map((el) => el.toLowerCase())
                    .filter(
                        (el) => el.length >= 3 && el != "the" && el != "for"
                    );

                if (ppv)
                console.log({ splitPPV });
                vids = vids
                    .filter(
                        (el) =>
                            !ppv ||
                            el.title
                                .toLowerCase()
                                .split(" ")
                                .findIndex((el2) => splitPPV.includes(el2)) !=
                                -1
                    )
                    .filter(
                        (el) =>
                            ["conference", "promotion", "talk", "behind", "press"].findIndex((it) =>
                                el.title.toLowerCase().includes(it)
                            ) == -1
                    );
                console.log({ videos: vids.length }, "\n");
                data.push(...vids);
            } catch (err) {
                handleErrs(err);
            }
        };

        if (side == "ppv") {
            for (let ppv of listPPV) {
                await _fn(ppv);
            }
        } else {
            await _fn();
        }

        return data;
    } catch (err) {
        console.log("Failed to get page videos");
        handleErrs(err);
        return [];
    }
};

const getStremingSiteLinks = async (url: string) => {
    try {
        const { data: html } = await _axios.get(url);
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
        
        // Additional info
        const infoSelector = "#details > .rich-content > ul"
        const _info = _$(infoSelector)
        const infoItems = _$("li", _info)
        let info = "<ul class='tu-wwe-info'>"
        console.log({_info: _info.length});
        for (let item of infoItems){
            info += `<li class="tu-item">${_$(item).html()}</li>`
        }
        info += "</ul>"
        
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
            if (!txt || !href || txt.toLowerCase().includes("kick off")) continue;

            const { data: html } = await _axios.get(href);
            const $$ = cheerio.load(html);

            const embedUrl = $$("#show_adv_wrap iframe").attr("src");
            if (!embedUrl) continue;

            finalData.push({ label: txt, url: embedUrl });
        }
        return {links: finalData, info};
    } catch (err) {
        console.log("Failed to get page videos");
        handleErrs(err);
        return {};
    }
};

export const wweVideoScraper = async ({
    side,
    maxPages = 50,
    vidsPerPage,
}: {
    side: IVideoSide;
    maxPages?: number;
    vidsPerPage?: number;
}) => {
    console.log({ side });
    if (side == "all" || !side) {
        const rawRes = await wweVideoScraper({
            side: "raw",
            maxPages,
            vidsPerPage,
        });
        const smackdownRes = await wweVideoScraper({
            side: "smackdown",
            maxPages,
            vidsPerPage,
        });
        const ppvRes = await wweVideoScraper({
            side: "ppv",
            maxPages,
            vidsPerPage,
        });
        return rawRes + smackdownRes + ppvRes;
    }
    const { TuVid } = await import("@cmn/utils/tu-wwe/models");
    /**
     * # Stepts
     * - Visit url1 [https://watchwrestling.ec/wwe-raw/page/1]
     *      - Get all page video links [a.clip-link]
     *          - url = [href], thumbnail = [a img.src]
     *          - Go to [url]
     *              - Get dailymotion links
     *                  - Go to each link and get video url
     */
    timedLog(`\nBEGIN VIDEO SCRAPER FOR ${side.toUpperCase()}`, {
        maxPages,
        vidsPerPage,
    });
    // const finalVidoes: IVideo[] = []
    const log = (...args: any) => {
        timedLog(`[${side || ""}]`, ...args);
    };
    // Save old videos to be cleared once all is good
    const oldVideos = (await TuVid.find({ side }).exec()).map((el) => el.id);
    for (let page = 0; page < maxPages; page++) {
        console.log(`\n[${side || ""}] SCRAPING PAGE ${page + 1}`);
        const vids = await getPageVideos(page, side);
        if (!vids.length) break;
        for (let it of vids.slice(0, vidsPerPage)) {
            const links = await getStremingSiteLinks(it.url);
            if (!links.links) continue;
            let _title = it.title.split("–")[0]
            log({ title: _title });

            const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/;
            const match = it.title.match(dateRegex);
            const date = match ? match[0] : "";
            if (!date) continue
            const v: IVideo = {
                title: _title.replaceAll("Adfree", "").replaceAll(date, "").trim(),
                side,
                thumb: it.thumb,
                links: links.links,
                date,
                info: links.info
            };
            const tuVid = new TuVid({ ...v });
            await tuVid.save();
            // console.log(tuVid.side);
            // finalVidoes.push(v)
            // console.log("\n", links);
        }
    }

    // Delete the old videos
    for (let vidId of oldVideos) {
        await TuVid.findByIdAndDelete(vidId);
    }
    timedLog("VIDEO SCRAPER FINISHED");
    return await TuVid.countDocuments({ side });
};
