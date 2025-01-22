import axios from "axios";
import * as cheerio from "cheerio";
import { writeFileSync } from "fs";

async function scrape() {
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

    console.log("Begin...");
    const { data } = await axios.get(links[0]);
    const $ = cheerio.load(data);

    const yearData: { year: string; subjects: {
        name: string; papers: {date: string; paper: {name: string; link: string}[]}[]
    }[] }[] = [];
    const yearNodes = $("button.tablinks");
    const yearContent = $(".tabcontent");

    for (let i = 0; i < yearNodes.length; i++) {
        const yn = yearNodes[i], content = yearContent[i];

        const subjectsHdNodes = $("button.accordion", content);
        const subjectContentNodes = $(".table-container", content)
        
        const subjects = [...subjectsHdNodes].map((sh, i)=>{
            // Returns each subject data
            const subjectHeader = subjectsHdNodes[i], subjectContentNode = subjectContentNodes[i];
            const subjectName = $(subjectHeader).text()

            const dates = [...$("[role='columnheader']", subjectContentNode)].map(el=> $(el).text())
            const papers = [...$("[role='cell']", subjectContentNode)].map((el, i)=>{
                const _paper = $($("a.paper", el)[0])
                const _memo =$( $("a.memo", el)[0])
                const paper = {name: _paper.text(), link: _paper.attr("href") || ''}
                const memo = {name: _memo.text(), link: _memo.attr("href") || ''}
                return {date: dates[i], paper: [paper, memo]}
            })
            return {name: subjectName, papers}
        })


        
        yearData.push({year: $(yn).text(), subjects: subjects })
    }
    writeFileSync("data/scraper.json", JSON.stringify(yearData))
    // const href = $('.download__button a').attr("href");
    // console.log({href});
}

scrape();
