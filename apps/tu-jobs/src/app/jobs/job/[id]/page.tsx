import ApplyBtn from "@/components/JobApplyBtn";
import { SITE } from "@/utils/consts";
import { getJobById } from "@/utils/server/funcs";
import { scrapeJobDetails } from "@/utils/server/scraper";
import TMeta from "@repo/ui-next/components/TMeta";
import TuErrorPage from "@repo/ui-next/components/TuErrorPage";
import UDivider from "@repo/ui-next/components/UDivider";
import Page from "./p";
import { IObj } from "@cmn/utils/interfaces";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    console.log('\nGETTING JOB BY ID', id);
    const job = await getJobById(id);
    if (!job) {
        return <TuErrorPage status={404} msg="Ooops! Job not in database." />;
    }
    if (job.meta){
        console.log("[HAS META]");
    }
    const jobData = job.meta ? job : await scrapeJobDetails(job.link, job.source);
    return (
        <>
            <TMeta title={`${job.title} - ${SITE}`} />
            <div className="w-full h-full">
                <Page jobData={jobData} job={job} />
            </div>
        </>
    );
};

export default page;
