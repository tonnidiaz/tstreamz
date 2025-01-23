import axios from "axios";
import * as cheerio from "cheerio";
import { PastPaper, TuApp } from "./models";
import { clearTerminal, handleErrs, timedLog } from "@cmn/utils/funcs";
import type { IPaperDoc, IPastPaper } from "../interfaces";

export const scrapeDocLink = async (link: string) => {
    try {
        if (!link) return;
        const { data } = await axios.get(link);
        const $ = cheerio.load(data);
        const a = $("p.download__button a");
        return new URL(a.attr("href")).searchParams.get("id");
    } catch (err) {
        // handleErrs(err);
        return null;
    }
};
export async function scrapePastPapers() {
    clearTerminal();
    /**
     * STEPS:
     * 1: Go to https://wcedeportal.co.za/past-papers
     *      - Get all tablinks (btn.tablinks)
     *      - Get all tabContents (.tabcontent)
     *      - Get all subject names (button.accordion)
     *      - Get table for each subjectNode (.table-container)
     *          - Get date paper dates (role=columnheader
     *          - Get paper nodes (role=cell)
     *              - Get paper link (a.paper)
     *              - Get memo link (a.memo)
     */

    const links = ["https://wcedeportal.co.za/past-papers"];

    timedLog("Scraping past papers...");
    const { data } = await axios.get(links[0]);
    const $ = cheerio.load(data);

    const yearNodes = $("button.tablinks");
    const yearContent = $(".tabcontent");
    const tuApp = (await TuApp.findOne({}).exec()) || new TuApp();
    await PastPaper.deleteMany({}).exec();
    tuApp.past_papers = [];

    for (let i = 0; i < yearNodes.length; i++) {
        const yn = yearNodes[i],
            content = yearContent[i];
        const year = $(yn).text();

        const subjectsHdNodes = $("button.accordion", content);
        const subjectContentNodes = $(".table-container", content);

        for (let i = 0; i < subjectsHdNodes.length; i++) {
            const shNode = subjectsHdNodes[i],
                subjectContentNode = subjectContentNodes[i];
            const subjectName = $(shNode).text();

            const dates = [
                ...$("[role='columnheader']", subjectContentNode),
            ].map((el) => $(el).text());

            const papers: {
                date: string;
                docs: IPaperDoc[];
            }[] = [];

            /**
             * paperNode = <div><p>paper</p>memo<p></p></div> or subject
             */
            const paperNodes = $("[role='cell']", subjectContentNode);
            for (let i = 0; i < paperNodes.length; i++) {
                const paperNode = paperNodes[i];
                if (!dates[i]) continue;
                const date = dates[i].replaceAll(" ", "").replaceAll("/", "_");

                const _paperContainers = $($("p", paperNode));
                const docs: IPaperDoc[] = [];
                const maxLen = _paperContainers.length;
                let cnt = 0
                for (let i = 0; i < maxLen; i++) {
                    const paperCont = _paperContainers[i];

                    const paper = $("a.paper", paperCont);
                    const memo = $("a.memo", paperCont);

                    const name = paper.text();
                    if (!memo) continue;
                    if (
                        ["book", "boek"].find((el) =>
                            name.toLowerCase().includes(el)
                        )
                    )
                        continue;
                    if (
                        year == "2023" &&
                        subjectName.toLowerCase() == "accounting"
                    )
                        console.log("\n", {
                            date,
                            paper: name,
                            memo: memo.text(),
                        });

                    const paperHref = paper.attr("href") || "";
                    const memoHref = memo.attr("href") || "";
                    if (!paperHref) continue;
                    scrapeDocLink(paperHref).then((paperLink) => {
                        if (!paperLink) return;
                        scrapeDocLink(memoHref).then((memoLink) => {
                            docs.push({
                                paper: { name, link: paperLink },
                                memo: memoLink
                                    ? { name: memo.text(), link: memoLink }
                                    : undefined,
                            });
                            cnt += 1
                            if (cnt >= maxLen){
                                timedLog("All done")
                            }
                        });
                    });

                    // const memoLink = await ;

                    // docs.push({
                    //     paper: { name, link: paperLink },
                    //     memo: memoLink
                    //         ? {
                    //               name: memo.text(),
                    //               link: memoLink,
                    //           }
                    //         : undefined,
                    // });
                }

                // papers.push({ date, docs });
            }
            // const data: IPastPaper = {
            //     year,
            //     subject: subjectName,
            //     papers,
            // };
            // const paperData = new PastPaper({ ...data });
            // await paperData.save();
        }

        tuApp.past_papers.push(year);
    }
    await tuApp.save();
    console.log("Finished scraping past papers!");
    return await PastPaper.countDocuments();
    // writeFileSync("data/scraper.json", JSON.stringify(yearData));
    // const href = $('.download__button a').attr("href");
    // console.log({href});
}
