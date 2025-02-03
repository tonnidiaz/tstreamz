"use client";
import ApplyBtn from "@/components/JobApplyBtn";
import JobCard from "@/components/JobCard";
import { IJob, IJobExt } from "@/utils/interfaces";
import { TJobData } from "@/utils/server/funcs";
import { scrapeJobDetails, scrapeSimilarJobs } from "@/utils/server/scraper";
import UDivider from "@repo/ui-next/components/UDivider";
// import { useTuState } from "@repo/ui-next/lib/hooks";
import { useEffect, useRef, useState } from "react";

const Page = ({
    jobData,
    job,
}: {
    jobData: Awaited<ReturnType<typeof scrapeJobDetails>>;
    job: TJobData;
}) => {
    const pageRef = useRef<HTMLDivElement>(null);
    const similarJobs = useState<IJobExt[]>();

    const init = async () => {
        // Fetch similar jobs
        console.log("\n[FETCHING SIMILAR JOBS...]");
        similarJobs[1](null);
        const res = await scrapeSimilarJobs(job.title);
        similarJobs[1](res);
    };

    useEffect(() => {
        console.log("Mounted");
        init();
    }, []);
    useEffect(() => {
        pageRef.current?.scrollIntoView();
    }, [pageRef.current]);
    return (
        <div className="p-4 w-full h-full" ref={pageRef}>
            <div className="md:h-full flex md:flex-row flex-col-reverse gap-2 justify-start items-center md:items-start md:justify-center w-full">
                <div
                    id="similar-jobs"
                    className="bordered p-3 flex flex-col gap-2 w-600tw md:w-350tw max-h-100p oy-scroll"
                >
                    <h3 className="my-3">Similar jobs</h3>
                    {!similarJobs[0]?.length ? (
                        <div className="loading-div">
                            {!similarJobs[0] ? (
                                <div className="loading loading-lg loading-ring"></div>
                            ) : (
                                <p className="fs-18 text-center">
                                    Nothing to show
                                </p>
                            )}
                        </div>
                    ) : (
                        similarJobs[0].map((el, i) => (
                            <JobCard key={`job-${i}`} job={el} />
                        ))
                    )}
                </div>
                <div
                    id="job-info"
                    className="w-600px p-3 bordered rounded-md max-h-100p oy-scroll"
                >
                    <h1 className="fs-22">{job.title}</h1>
                    <div className="my-2 bordered rounded-md p-3 color-text-2 fs-14">
                        <div className="tu-job-meta">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: jobData.meta,
                                }}
                            ></div>
                            <div className="mt-4">
                                <ApplyBtn id={job.jobId} />
                            </div>
                        </div>
                    </div>
                    <UDivider className="my-1" />
                    <div className="my-2 fs-15 bordered rounded-md p-3">
                        {jobData.descHtml.map((el, i) => (
                            <div
                                key={`el-${i}`}
                                dangerouslySetInnerHTML={{ __html: el }}
                            />
                        ))}

                        <UDivider />
                        <div className="mt-4">
                            <ApplyBtn id={job.jobId} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
