export interface IJob {
    title: string;
    link: string;
    jobId: string;
    posted: string,
    exp: string,
}

export interface IJobExt extends IJob {id: string; meta: string; html?: string[];}

export type IFilters = {
    contractType?: string;
    minSalary?: number;
    sectors: string[];
}
