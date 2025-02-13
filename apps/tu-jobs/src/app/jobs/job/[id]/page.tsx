import ApplyBtn from "@/components/JobApplyBtn";
import { SITE } from "@/utils/consts";
import { getJobById } from "@/utils/server/funcs";
import { scrapeJobDetails } from "@/utils/server/scraper";
import TMeta from "@repo/ui-next/components/TMeta";
import TuErrorPage from "@repo/ui-next/components/TuErrorPage";
import UDivider from "@repo/ui-next/components/UDivider";
import Page from "./p";
import { IObj } from "@cmn/utils/interfaces";
import { Metadata } from "next";

let jobData: {
    title: string;
    jobId: string;
    link: string;
    meta: string;
    descHtml: string[];
    posted: string;
    exp: string;
    location: string;
    contract: string;
};

let job: Awaited<ReturnType<typeof getJobById>>;

interface IProps {
    params: Promise<{ id: string }>;
}
export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { id } = await params;
    console.log("\nGETTING JOB BY ID", id);
    job = await getJobById(id);
    if (!job) throw Error("Could not get job");

    if (job.meta) {
        console.log("[HAS META]");
    }
    jobData = job.meta ? job : await scrapeJobDetails(job.link, job.source);

    return {
        title: `${job.title} - ${SITE}`,
        description: job.meta,
    };
}

const page = async ({ params }: IProps) => {
    if (!job) {
        return <TuErrorPage status={404} msg="Ooops! Job not in database." />;
    }

    return (
        <>
            <div className="w-full h-full">
                <Page jobData={jobData} job={job} />
            </div>
        </>
    );
};

export default page;
