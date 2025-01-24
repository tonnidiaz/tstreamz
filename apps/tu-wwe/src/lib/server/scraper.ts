import axios from "axios";
import * as cheerio from "cheerio";

const getPageVideos = async (page: number) =>{
    try {
        page += 1
        const url = `https://watchwrestling.ec/wwe-raw/page/${page}`
        const {data: html} = await axios.get(url)
        const $ = cheerio.load(html)

        // Select all videos [<a></a>]
        const videos = $("a.clip-link")
        const titles = $(".entry-title")
        console.log("\n", {page, videos: videos.length});
        const data = [...videos].map((el, i)=>{
            const url = $(el).attr("href") || "";
            const img = $("img", el).attr("src") || ""
            return {title: $(titles[i]).text(), url, thumb: img}
        })

        return data
    } catch (err) {
        console.log("Failed to get page videos", err)
        return []
        
    }
}

const getStremingSiteLinks = async (url: string) =>{
    try {
        const {data: html} = await axios.get(url)
        const _$ = cheerio.load(
            html
        );
        const script = [..._$("script")].find(el=> _$(el).text().toLowerCase().includes("episoderepeater"))
        const dt = _$(script).text().split(`append("`).pop()!.split("</textarea>")[0] + "</textarea>"
        const _html = _$(dt).text()
        const $ = cheerio.load(
            _html
        );
        const links = $(".episodeRepeater");
        // console.log(dt);
        console.log("\n", links.length);
        const dailyMotionLinksCont = [...links].find(el=> $(el).text().toLowerCase().includes("dailymotion"))
        const dailyMotionLinks = $("a.responsive_custom_btn", dailyMotionLinksCont);

        const finalData: {label: string, url: string}[] = []
        for (let link of dailyMotionLinks){
            const $link = $(link)
            const txt = $link.text()
            const href = $link.attr("href")
            if (!txt || !href) continue

            const {data: html} = await axios.get(href)
            const $$ = cheerio.load(html)
           
           const embedUrl = $$("#show_adv_wrap iframe").attr("src")
           if (!embedUrl) continue

           finalData.push({label: txt, url: embedUrl})
        }
        return finalData
    } catch (err) {
        console.log("Failed to get page videos", err)
        return []
        
    }
}

interface IVideo {title: string, thumb: string; links: {label: string; url: string}[]}
export const videsScraper = async () => {
    /**
     * # Stepts
     * - Visit url1 [https://watchwrestling.ec/wwe-raw/page/1]
     *      - Get all page video links [a.clip-link]
     *          - url = [href], thumbnail = [a img.src]
     *          - Go to [url]
     *              - Get dailymotion links
     *                  - Go to each link and get video url
     */

    const finalVidoes: IVideo[] = []
    const maxPages = 1
    for (let page = 0; page < maxPages; page++)
    {
        const vids = await getPageVideos(page)
        console.log(vids);
        for (let it of vids.slice(0, 2)){

            const links = await getStremingSiteLinks(it.url);
            const v: IVideo = {title: it.title, thumb: it.thumb, links}
            finalVidoes.push(v)
            console.log("\n", links);
        }
    }

};