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

const fetchData = async (id: string) =>{
    const job = await getJobById(id);
    console.log('\nGETTING JOB BY ID', id);
    if (job && job.meta){
        console.log("[HAS META]");
    }
    const jobData = !job ? undefined : job.meta ? job : await scrapeJobDetails(job.link, job.source);
    return {job, jobData}
}


interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({params} : Props) {
    const { id } = await params;
    const {job} = await fetchData(id);
    if (!job) return
    return {title: `${job.title} - ${SITE}`} as Metadata
}

const page = async ({ params }: Props) => {
    const { id } = await params;
    const {job, jobData} = await fetchData(id)
    
    if (!job) {
        return <TuErrorPage status={404} msg="Ooops! Job not in database." />;
    }
    
    return (
        <>
            {/* <TMeta title={`${job.title} - ${SITE}`} /> */}
            <div className="w-full h-full">
                <Page jobData={jobData} job={job} />
            </div>
        </>
    );
};

export default page;
