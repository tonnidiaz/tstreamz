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
    careers24: axios.create({ baseURL: baseUrls.careers24 }),
    careerjunction: axios.create({ baseURL: baseUrls.careerjunction }),
};
const testFilesDir = "./src/utils/server/data/scraper";
const parseDate = (date: Date) => date.toISOString().split("T")[0];

const getSelectors = (source: TJobSource) => {
    let locationSelector = "";
    let titleSelector = "",
        dateSelector = "",
        expSelector = "",
        jobTypeSelector = "";
    let linkSelector = "a"
    if (source == "careers24") {
        titleSelector = ".job-card-head";
        locationSelector = "ul li:nth-child(1)";
        dateSelector = "ul li:nth-child(3)";
        expSelector = dateSelector;
        jobTypeSelector = "ul li:nth-child(2)";
    } else if (source == "simplify") {
        titleSelector = "a.job-title";
        locationSelector = ".job-heading-row .job-location";
        jobTypeSelector = ".job-heading-row .job-type";
        dateSelector = ".tu-summary > div:nth-child(2) > div:nth-child(3)";
        expSelector = ".tu-summary > div:nth-child(2) > div:nth-child(4)";
        linkSelector = titleSelector
    }

    return {
        titleSelector,
        dateSelector,
        locationSelector,
        expSelector,
        jobTypeSelector,
        linkSelector
    };
};
export const scrapeJobs = async (
    source: TJobSource,
    endpoint?: string,
    page = 1
) => {
    try {
        console.log(`\n[SCRAPER] BEGIN:`, { source, endpoint });

        if (source == "careerjunction")
            return await scrapeCareerJunctionJobs(endpoint, page);

        const ep1 = "jobs";
        let url = `${baseUrls[source]}`;
        let jobCardSelector = "";

        switch (source) {
            case "simplify":
                url = url.replace("{ep}", ep1);
                break;

            default:
                url += `/${ep1}`;
                break;
        }

        switch (source) {
            case "careers24":
                jobCardSelector = ".job-card";
                break;
            case "simplify":
                jobCardSelector = "#jobsListContainer .job-heading-row";
                break;
        }


        const { data: html } = useDummy
            ? { data: readRaw(`${testFilesDir}/${source}/page1.html`) }
            : await axios.get(url + `/${endpoint}`, { params: { page } });
        const $ = cheerio.load(html);

        const {
            titleSelector,
            dateSelector,
            locationSelector,
            jobTypeSelector,
            expSelector,
            linkSelector
        } = getSelectors(source);


        const jobCards = $(jobCardSelector).map((_, el) => {
            if (source == "simplify") {
                // el is the heading-row
                // need to get the details row also
                const summaryCont = $(el).next(".row");
                summaryCont.addClass("tu-summary");
                $(el).append(summaryCont);
                const _link = $(linkSelector, el).attr('href').trim()
                let id = new URL(_link).host.split(".")[0]
                id += `__${_link.split("/").pop()}`
                $(el).data("id", id)
            }
            return el;
        });
        const jobs: IJobExt[] = [];

        for (let el of jobCards) {
            
            const title = $(titleSelector, el)
                .text()
                .replaceAll("\n", " ")
                .trim();

            const dateLi = $(dateSelector, el);
            console.log("\n", { title });

            const locationLi = $(locationSelector, el);
            const jobTypeLi = $(jobTypeSelector, el);

            let location = "",
                jobType = "", posted = "", exp = "";
            let datePostedStr = "", expStr = "";
            let datePosted = new Date(),
                expDate = new Date();
            
            location = locationLi.text().trim();
            jobType = jobTypeLi.text().trim();

            if (source == "careers24") {
                
                jobType = jobTypeLi.text().split(":").pop().trim();
                const dateList = dateLi
                    .text()
                    .trim()
                    .split("\n")
                    .flatMap((el) => {
                        return !el ? [] : el.trim();
                    });
                datePostedStr = dateList[0].split(":").pop().trim() + " 13:00";
                const daysLeft = Number(dateList.pop().split(" ")[0]);
                if (isNaN(daysLeft)) continue;

                datePosted = new Date(datePostedStr);
                expDate = new Date(datePosted);
                expDate.setDate(expDate.getDate() + daysLeft);
                posted = parseDate(datePosted);
                exp = parseDate(expDate);
            } else if (source == "simplify") {
                datePostedStr = dateLi
                    .text()
                    .replace("Posted Date:", "")
                    .trim();
                expStr = $(expSelector, el).text().replace("Closing Date:", "").trim();
                posted = datePostedStr
                exp = expStr
            }

            console.log(datePostedStr);

            const link = $(linkSelector, el).attr("href");

            const jobId = $(el).data("id") as string;

            const meta = `<ul class='tu-job-meta fs-14'>
                <li><span>Contract type:</span>&nbsp;${jobType}</li>
                <li><span>Location:</span>&nbsp;${location}</li>
                <li><span>Date posted:</span>&nbsp;<span class='text-secondary'>${posted}</span></li>
                <li><span>Closing date:</span>&nbsp;<span class='text-secondary'>${exp}</span></li>
            </ul>`;

            const jobExistsInDb = await JobModel.findOne({ jobId }).exec();
            console.log({jobId, jobExistsInDb: jobExistsInDb?.title});
            const job =
                jobExistsInDb ||
                new JobModel({
                    title,
                    link,
                    jobId,
                    posted,
                    exp,
                    source,
                    location,
                    contract: jobType
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
                source,
                location,
                contract: jobType
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
export const scrapeSimilarJobs = async (source: TJobSource, title: string) =>{
    let endpoint = "";
    title = title.split(" ").slice(0, 2).join(" ")
    switch(source){
        case "careers24":
            endpoint = `kw-${title}`;
            break;
        case "simplify":
            endpoint = `?query=${title}`
    }
   return  (await scrapeJobs(source, endpoint)).filter((el) => el.title != title);}

export async function scrapeJobDetails(link: string, source: TJobSource) {
    try {
        let dummyFile = `${source}/page2.html`;
        console.log("[SCRAPE_JOB_DETAILS]",{dummyFile});
        if (source == "simplify"){}
        else {
            link  = baseUrls[source] + link 
        }
       
        const { data: html2 } = useDummy
            ? { data: readRaw(`${testFilesDir}/${dummyFile}`) }
            : await axios.get(link);
        const $ = cheerio.load(html2);

        let title = "";

        // job-details
        let jobId = "";

        let posted = "",
            exp = "";
        let descSelector = "",
            metaSelector = "";
        // const detailsSec = $$(".job-details");
        switch (source) {
            case "careers24":
                jobId = link.split("-")[0].split("/").pop();
                title = $(".vacancy-detail-col h1").text().trim();
                descSelector = ".v-descrip";
                metaSelector = ".detailsList ul";
                break;
            case "careerjunction":
                descSelector = "div.job-details";
                metaSelector = ".job-overview";
                const t1 = $("#jobDesc h1");
                const t2 = $("#jobDesc h2");
                title = (t1.length ? t1 : t2).text().trim();
                jobId = link.split("/").pop();
                const el = $(".job-overview");
                const { posted: p, exp: e } = await getDates($, el, source);
                posted = parseDate(p);
                exp = parseDate(e);
                break;
            case "simplify":
                title = $(".hero-vacancy-title").text().trim();
                descSelector = ".tu-job-desc";

                // Select description sections and add selector class
                $(".new-job-details").addClass(descSelector.replace(".", ""))
                $(".vacancy-description").addClass(descSelector.replace(".", ""))
                metaSelector = ""
        }
       
        for (let el of $(descSelector)){
             $("*", el).removeAttr("class")
        }
        const descHtml = [...$(descSelector)].map((el) => $(el).html().trim());
        let meta = $(metaSelector).html()?.trim();
        if(meta)
            meta = `<ul>${meta}</ul>`;
        // const deadlineInfo = $(".smallest-text").text().trim();
        // meta += `<div class='deadline-info'>${deadlineInfo}</div>`;
        return { title, jobId, link, meta, descHtml, posted, exp, location: "", contract: "" };
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
        case "careers24":
            break;
        case "careerjunction":
            const dateLi = $("li.updated-time", el);
            const postedStr = dateLi
                .text()
                .replace("Posted ", "")
                .slice(0, 11)
                .trim();
            console.log({ postedStr });
            dates.posted = new Date(postedStr + " 13:00");
            const daysLeft = Number($("li.expires", el).text().split(" ")[2]);
            if (!isNaN(daysLeft)) {
                const expDate = new Date(dates.posted);
                expDate.setDate(expDate.getDate() + daysLeft);
                dates.exp = expDate;
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
            const _dates = await getDates($, el, "careerjunction");
            const datePosted = _dates.posted;
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
                source: "careerjunction", location, contract: jobType
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
