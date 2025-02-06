import { jobSources } from "./consts";

export interface IJob {
    title: string;
    link: string;
    jobId: string;
    posted: string,
    exp: string,
    source: TJobSource,
    location: string, contract: string
}

export interface IJobExt extends IJob {id: string; meta: string; html?: string[];}

export type IFilters = {
    location?: string;
    source: TJobSource;
    contractType?: string;
    keyword?: string;
    minSalary?: number;
    sectors: string[];
}

export type TJobSource = typeof jobSources[number] 