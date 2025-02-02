"use server";
import { handleErrs } from "@cmn/utils/funcs";
import axios from "axios";
import * as cheerio from "cheerio";
import { IJob } from "../interfaces";

const baseURL = "https://www.careers24.com";
const api = axios.create({ baseURL });
export const scrapeJobs = async () => {
    try {
        console.log("\n[SCRAPER] BEGIN...");
        const { data: html } = await api.get("/jobs");
        const $ = cheerio.load(html);
        const jobCards = $(".job-card");

        const jobs: IJob[] = [];

        for (let el of jobCards) {
            const title = $(".job-card-head", el).text().trim();
            console.log(`\nJOB: ${title}`);
            const link = $("a", el).attr("href");

            const jobId = $(el).data().id as string;
            const applyLink = `${baseURL}/jobs/apply/${jobId}`;

            const { data: html2 } = await api.get(link);
            const $$ = cheerio.load(html2);
            const descHtml = [...$$(".v-descrip")].map((el) =>
                $$(el).html().trim()
            );
            let meta = $$(".detailsList ul").html().trim();
            meta = `<ul>${meta}</ul>`
            const deadlineInfo = $$(".smallest-text").text().trim();
            meta += `<div class='deadline-info'>${deadlineInfo}</div>`
            jobs.push({ title, jobId, html: descHtml, applyLink, meta });
        }
        return jobs;
    } catch (err) {
        handleErrs(err);
        return [];
    }
};
