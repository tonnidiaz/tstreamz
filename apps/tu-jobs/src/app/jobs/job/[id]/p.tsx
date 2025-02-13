"use client";
import ApplyBtn from "@/components/JobApplyBtn";
import JobCard from "@/components/JobCard";
import { genApplyLink } from "@/utils/funcs";
import { IJob, IJobExt } from "@/utils/interfaces";
import { TJobData } from "@/utils/server/funcs";
import { scrapeJobDetails, scrapeSimilarJobs } from "@/utils/server/scraper";
import UButton from "@repo/ui-next/components/UButton";
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
    if (!job) return;
    const pageRef = useRef<HTMLDivElement>(null);
    const similarJobs = useState<IJobExt[]>();

    const init = async () => {
        // Fetch similar jobs
        console.log("\n[FETCHING SIMILAR JOBS...]");
        similarJobs[1](null);
        const res = await scrapeSimilarJobs(job.source, job.title);
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
                        similarJobs[0].flatMap((el, i) =>
                            el.title == job.title ? (
                                []
                            ) : (
                                <JobCard key={`job-${i}`} job={el} />
                            )
                        )
                    )}
                </div>
                <div
                    id="job-info"
                    className="w-750px p-3 bordered rounded-md max-h-100p oy-scroll"
                >
                    
                    <div className="my-2 bordered rounded-md p-3">
                        <h1 className="fs-20">{job.title}</h1>
                        <div className="tu-job-meta mt-3">
                            {jobData.meta?.length ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: jobData.meta,
                                    }}
                                ></div>
                            ) : (
                                <ul>
                                    <li><span>Contract type:</span>&nbsp;{job.contract}</li>
                                     <li><span>Location:</span>&nbsp;{job.location}</li>
                                    <li>
                                        <span>Date posted:</span>&nbsp;
                                        <span className="text-secondary">
                                            {job.posted}
                                        </span>
                                    </li>
                                    <li>
                                        <span>Closing date:</span>&nbsp;
                                        <span className="text-secondary">
                                            {job.exp}
                                        </span>
                                    </li>
                                </ul>
                            )}
                            <div className="mt-4 flex items-center gap-3">
                                <ApplyBtn
                                    link={genApplyLink(job.jobId, job.source)}
                                />
                                <UButton className="btn-md"><span><i className="fi fi-rr-heart"></i></span> Add to favorites</UButton>
                            </div>
                        </div>
                    </div>
                    <UDivider className="my-1" />
                    <div className="my-2 fs-14 bordered rounded-md p-3">
                        {jobData.descHtml.map((el, i) => (
                            <div
                                key={`el-${i}`}
                                dangerouslySetInnerHTML={{ __html: el }}
                            />
                        ))}

                        <UDivider />
                        <div className="mt-4">
                            <ApplyBtn className="w-full"
                                link={genApplyLink(job.jobId, job.source)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
