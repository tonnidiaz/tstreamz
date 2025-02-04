export interface IJob {
    title: string;
    link: string;
    jobId: string;
    posted: string,
    exp: string,
}

export interface IJobExt extends IJob {id: string; meta: string; html?: string[];}

export type IFilters = {
    location?: string;
    contractType?: string;
    keyword?: string;
    minSalary?: number;
    sectors: string[];
}
