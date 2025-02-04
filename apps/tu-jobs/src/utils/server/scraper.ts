"use server";
import { handleErrs } from "@cmn/utils/funcs";
import axios from "axios";
import * as cheerio from "cheerio";
import { IJobExt, TJobSource } from "../interfaces";
import { baseUrls, useDummy } from "../consts";
import { genApplyLink, genCareerJunctionId } from "../funcs";
import { readRaw } from "@cmn/utils/bend/funcs";
import { JobModel } from "@/models";

const apis = {
    career24: axios.create({ baseURL: baseUrls.careers24 }),
    careerjunction: axios.create({ baseURL: baseUrls.careerjunction })
}
const testFilesDir = "./src/utils/server/data/scraper";
const parseDate = (date: Date) => date.toISOString().split("T")[0];

export const scrapeJobs = async (
    source: TJobSource,
    endpoint?: string,
    page = 1
) => {
    try {
        console.log(`\n[SCRAPER] BEGIN:`, { source, endpoint });

        if (source == "careerjunction")
            return await scrapeCareerJunctionJobs(endpoint, page);
        const { data: html } = useDummy
            ? { data: readRaw(`${testFilesDir}/page1.html`) }
            : await apis[source].get(`/jobs/${endpoint || ""}`, { params: { page } });
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
            if (isNaN(daysLeft)) continue;
            const datePosted = new Date(datePostedStr);
            const expDate = new Date(datePosted);
            expDate.setDate(expDate.getDate() + daysLeft);

            const link = $("a", el).attr("href");

            const jobId = $(el).data().id as string;

            const posted = parseDate(datePosted),
                exp = parseDate(expDate);

            const meta = `<ul class='tu-job-meta fs-14'>
                <li><span>Contract type:</span>&nbsp;${jobType}</li>
                <li><span>Location:</span>&nbsp;${location}</li>
                <li><span>Date posted:</span>&nbsp;<span class='text-secondary'>${posted}</span></li>
                <li><span>Closing date:</span>&nbsp;<span class='text-secondary'>${exp}</span></li>
            </ul>`;

            const jobExistsInDb = await JobModel.findOne({ jobId }).exec();
            const job =
                jobExistsInDb ||
                new JobModel({
                    title,
                    link,
                    jobId,
                    posted,
                    exp,
                });
            if (!jobExistsInDb) await job.save();
            jobs.push({
                id: job.id,
                title,
                jobId,
                meta,
                exp,
                posted,
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
export const scrapeSimilarJobs = async (source: TJobSource, title: string) =>
    (await scrapeJobs(source, `kw-${title}`)).filter((el) => el.title != title);

export async function scrapeJobDetails(link: string, source: TJobSource) {
    try {
        let dummyFile = "page2.html"
        const api = apis[source]

        switch (source){
            case "careerjunction":
                dummyFile = `${source}/page2.html`
                break;
        }
        const { data: html2 } = useDummy
            ? { data: readRaw(`${testFilesDir}/${dummyFile}`) }
            : await api.get(link);
        const $ = cheerio.load(html2);

        let title = "";
        
        
        

        // job-details
        let jobId = "";

        let posted = "",
            exp = "";
        let descSelector = "", metaSelector = ""
        // const detailsSec = $$(".job-details");
        switch (source) {
            case "career24":
                jobId = link.split("-")[0].split("/").pop();
                title = $(".vacancy-detail-col h1").text().trim();
                descSelector = ".v-descrip";
                metaSelector = ".detailsList ul"
                break;
            case "careerjunction":
                descSelector = "div.job-details"
                metaSelector = ".job-overview"
                const t1 = $("#jobDesc h1")
                const t2 = $("#jobDesc h2")
                title = (t1.length ? t1 : t2).text().trim()
                jobId = link.split("/").pop();
                const el = $(".job-overview")
                const {posted: p, exp: e} = await getDates($, el, source)
                posted = parseDate(p);
                exp = parseDate(e);
                break;
        }

        const descHtml = [...$(descSelector)].map((el) =>
            $(el).html().trim()
        );
        let meta = $(metaSelector).html().trim();
        meta = `<ul>${meta}</ul>`;
        // const deadlineInfo = $(".smallest-text").text().trim();
        // meta += `<div class='deadline-info'>${deadlineInfo}</div>`;
        return { title, jobId, link, meta, descHtml, posted, exp };
    } catch (err) {
        handleErrs(err);
    }
}
export const getDates = async (
    $: cheerio.CheerioAPI,
    el: any,
    source: TJobSource
) => {
    const dates = { posted: new Date(), exp: null as Date | null };

    switch (source) {
        case "career24":
            break;
        case "careerjunction":
            const dateLi = $("li.updated-time", el);
            const postedStr = dateLi.text().replace("Posted ", "").slice(0, 11).trim()
            console.log({postedStr})
            dates.posted = new Date(
                postedStr + " 13:00"
            );
            const daysLeft = Number(
                $("li.expires", el)
                    .text()
                    .split(" ")[2]
            );
            if (!isNaN(daysLeft)) {
                const expDate = new Date(dates.posted);
                expDate.setDate(expDate.getDate() + daysLeft);
                dates.exp = expDate
            }

            break;
    }
    return dates;
};
const scrapeCareerJunctionJobs = async (endpoint?: string, page = 1) => {
    try {
        const { data: html } = useDummy
            ? { data: readRaw(`${testFilesDir}/careerjunction/page1.html`) }
            : await apis.careerjunction.get(`/jobs/${endpoint || ""}`, {
                  params: { page },
              });

        const $ = cheerio.load(html);
        const jobCards = $(".job-result");
        const jobs: IJobExt[] = [];
        for (let el of jobCards) {
            const titleEl = $(".job-result-title h2", el);
            const title = titleEl.text().trim();
            console.log(`\nJOB: ${title}`);

            const locationLi = $("li.location", el);
            const jobTypeLi = $("li.position", el);

            const location = locationLi.text().trim(),
                jobType = jobTypeLi.text().replace(" position", "");
            const _dates = await getDates($, el, "careerjunction")
                const datePosted = _dates.posted
                const expDate = _dates.exp;
            if (!expDate) continue;
            
            const jobId = $("a", titleEl).attr("jobid") as string;
            const link = genApplyLink(jobId, "careerjunction");
            const posted = parseDate(datePosted),
                exp = parseDate(expDate);

            const meta = `<ul class='tu-job-meta fs-14'>
                <li><span>Contract type:</span>&nbsp;${jobType}</li>
                <li><span>Location:</span>&nbsp;${location}</li>
                <li><span>Date posted:</span>&nbsp;<span class='text-secondary'>${posted}</span></li>
                <li><span>Closing date:</span>&nbsp;<span class='text-secondary'>${exp}</span></li>
            </ul>`;

            // const jobExistsInDb = await JobModel.findOne({ jobId }).exec();
            // const job =
            //     jobExistsInDb ||
            //     new JobModel({
            //         title,
            //         link,
            //         jobId,
            //         posted,
            //         exp,
            //     });
            // if (!jobExistsInDb) await job.save();
            jobs.push({
                id: genCareerJunctionId(jobId),
                title,
                jobId,
                meta,
                exp,
                posted,
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
