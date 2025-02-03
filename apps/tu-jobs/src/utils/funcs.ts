import { capitalizeFirstLetter } from "@cmn/utils/funcs";
import { JOB_ID_FACTOR } from "./consts";
import { IJob } from "./interfaces";

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
