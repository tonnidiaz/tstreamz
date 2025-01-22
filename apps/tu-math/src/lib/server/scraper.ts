import axios from "axios";
import * as cheerio from "cheerio";
import { PastPaper, TuApp } from "./models";
import { clearTerminal, timedLog } from "@cmn/utils/funcs";
import type { IPaperDoc, IPastPaper } from "../interfaces";

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
                const date = dates[i];
                const _paperContainers = $($("p", paperNode));
                const docs: IPaperDoc[] = [];

                for (let i = 0; i < _paperContainers.length; i++) {
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
                    docs.push({
                        paper: { name, link: paper.attr("href") || "" },
                        memo: {
                            name: memo.text(),
                            link: memo.attr("href") || "",
                        },
                    });
                }

                papers.push({ date, docs });
            }
            const data: IPastPaper = {
                year,
                subject: subjectName,
                papers,
            };
            const paperData = new PastPaper({ ...data });
            await paperData.save();
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
