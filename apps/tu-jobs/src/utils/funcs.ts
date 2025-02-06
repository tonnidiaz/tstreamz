import { capitalizeFirstLetter } from "@cmn/utils/funcs";
import { baseUrls, JOB_ID_FACTOR } from "./consts";
import { IJob, TJobSource } from "./interfaces";

export const parseJobId = (id: string) => {
    const split = id.split("-");
    const jobId = Number(split[0]) - JOB_ID_FACTOR,
        title = split.slice(1).map((el) =>
            el
                .replaceAll("_", " ")
                // .split(" ")
                // .map((el2) => capitalizeFirstLetter(el2))
                // .join(" ")
        ).join('-');
    return {title, jobId}
};

export const genJobId = (job: IJob) => `${Number(job.jobId) + JOB_ID_FACTOR}-${job.title.replaceAll(' ', '_').trim()}`
export const genCareerJunctionId = (id: string) => `TUJID_CJ-${id}`

export function genApplyLink(id: string, source: TJobSource): string {
    let link = ""
    const baseURL = baseUrls[source]
    // console.log("\n[GEN_APPLY_LINK]", {source, baseURL});
    switch (source){
        case "careers24":
            link = `${baseURL}/jobs/apply/${id}`;
            break;
        case "careerjunction":
            link = `${baseURL}/application/apply-link/${id}`;
            break;
        case "simplify":
            const splitId = id.split("__")
            link = `${baseURL.replace("{ep}", splitId[0])}/Vacancy/Apply/${splitId[1]}`
            break
    }
    return link
}
