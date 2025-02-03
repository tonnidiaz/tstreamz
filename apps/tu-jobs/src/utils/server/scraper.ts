"use server";
import { handleErrs } from "@cmn/utils/funcs";
import axios from "axios";
import * as cheerio from "cheerio";
import { IJobExt } from "../interfaces";
import { careers24BaseURL } from "../consts";
import { readRaw } from "@cmn/utils/bend/funcs";
import { JobModel } from "@/models";

const useDummy = true;
const api = axios.create({ baseURL: careers24BaseURL });

const testFilesDir = "./src/utils/server/data/scraper";
const parseDate = (date: Date) => date.toISOString().split("T")[0];

export const scrapeJobs = async (endpoint?: string, page = 1) => {
    try {
        console.log(`\n[SCRAPER] BEGIN: ${endpoint}...`);
        const { data: html } = useDummy
            ? { data: readRaw(`${testFilesDir}/page1.html`) }
            : await api.get(`/jobs/${endpoint || ""}`, { params: { page } });
        const $ = cheerio.load(html);
        const jobCards = $(".job-card");

        const jobs: IJobExt[] = [];

        for (let el of jobCards) {
            const title = $(".job-card-head", el).text().trim();
            console.log(`\nJOB: ${title}`);

            const dateLi = $("ul li:nth-child(3)", el);
            const locationLi = $("ul li:nth-child(1)", el);
            const jobTypeLi = $("ul li:nth-child(2)", el);

            const location = locationLi.text().trim(),
                jobType = jobTypeLi.text().split(":").pop().trim();

            const dateList = dateLi
                .text()
                .trim()
                .split("\n")
                .flatMap((el) => {
                    return !el ? [] : el.trim();
                });
            let datePostedStr = dateList[0].split(":").pop().trim() + " 13:00";
            console.log(datePostedStr);
            console.log(dateList);
            const daysLeft = Number(dateList.pop().split(" ")[0]);
            if (isNaN(daysLeft)) continue
            const datePosted = new Date(datePostedStr);
            const expDate = new Date(datePosted);
            expDate.setDate(expDate.getDate() + daysLeft);

            const link = $("a", el).attr("href");

            const jobId = $(el).data().id as string;
            const applyLink = `${careers24BaseURL}/jobs/apply/${jobId}`;

            const meta = `<ul class='tu-job-meta fs-14'>
                <li><span>Contract type:</span>&nbsp;${jobType}</li>
                <li><span>Location:</span>&nbsp;${location}</li>
                <li><span>Date posted:</span>&nbsp;<span class='text-secondary'>${parseDate(datePosted)}</span></li>
                <li><span>Closing date:</span>&nbsp;<span class='text-secondary'>${parseDate(expDate)}</span></li>
            </ul>`;

            const jobExistsInDb = await JobModel.findOne({ jobId }).exec();
            const job =
                jobExistsInDb ||
                new JobModel({
                    title,
                    link,
                    jobId,
                    posted: datePosted,
                    exp: expDate,
                });
            if (!jobExistsInDb) await job.save();
            jobs.push({
                id: job.id,
                title,
                jobId,
                meta,
                exp: expDate,
                posted: datePosted,
                link,
            });

            // console.log({ jobId, datePostedStr, daysLeft, jobType, location });
            // jobs.push({ title, jobId, html: descHtml, link: applyLink, meta });
        }
        return jobs;
    } catch (err) {
        handleErrs(err);
        return [];
    }
};
export const scrapeSimilarJobs = async (title: string) => (await scrapeJobs(`kw-${title}`)).filter(el=> el.title != title)

export async function scrapeJobDetails(link: string) {
    try {
        const { data: html2 } = useDummy
            ? { data: readRaw(`${testFilesDir}/page2.html`) }
            : await api.get(link);
        const $$ = cheerio.load(html2);
        const descHtml = [...$$(".v-descrip")].map((el) =>
            $$(el).html().trim()
        );
        let meta = $$(".detailsList ul").html().trim();
        meta = `<ul>${meta}</ul>`;
        const deadlineInfo = $$(".smallest-text").text().trim();
        meta += `<div class='deadline-info'>${deadlineInfo}</div>`;
        return { meta, descHtml };
    } catch (err) {
        handleErrs(err);
    }
}
