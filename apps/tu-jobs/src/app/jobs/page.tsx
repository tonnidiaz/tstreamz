"use client";
import JobCard from "@/components/JobCard";
import JobsFiltersSection from "@/components/JobsFiltersSection";
import { updateJobsState } from "@/redux/reducers/jobs";
import { RootState } from "@/redux/store";
import { store } from "@/store";
import { careers24BaseURL, forceFetchJobs, SITE } from "@/utils/consts";
import { IFilters, IJobExt } from "@/utils/interfaces";
import { scrapeJobs } from "@/utils/server/scraper";
import { handleErrs, isTuError } from "@cmn/utils/funcs";
import { showToast } from "@cmn/utils/funcs-ui";
import TMeta from "@repo/ui-next/components/TMeta";
import TuModal from "@repo/ui-next/components/TuModal";
import UButton from "@repo/ui-next/components/UButton";
import { DEV } from "@repo/ui-next/lib/consts";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const jobsStorageKey = "jobs";
const getSavedJobs = () => {
    return localStorage.getItem(jobsStorageKey);
};
const centerElementWidth = 768;
const page = () => {
    const dispatch = useDispatch()
    const jobsStore = useSelector((s: RootState) => s.jobs);
    const appStore = useSelector((s: RootState) => s.app);
    // const jobs = useTuState<IJobExt[] | null>();
    const fetchJobs = async (endpoint?: string) => {
        console.log('\n[FETCHING JOBS...]');
        dispatch(updateJobsState(["jobs", null]));
        const savedJobs = getSavedJobs();
        dispatch(
            updateJobsState(
                ["jobs",savedJobs && !forceFetchJobs
                    ? JSON.parse(savedJobs)
                    : await scrapeJobs(endpoint)]
            )
        );
    };

    useEffect(() => {
        if (!jobsStore.jobs) fetchJobs();
    }, []);

    

    const applyFilters = async () => {
        try {
            const _filters = jobsStore.filters;
            const params = {
                jt: _filters.contractType?.toLowerCase(),
                se: _filters.sectors.join(",").replaceAll(" ", "-"),
                sf: _filters.minSalary,
            };

            const endpoint = Object.entries(params)
                .flatMap(([k, v], i) => (!v ? v : `${k}-${v}`))
                .filter((el) => el !== undefined)
                .join("/")
                ?.toLowerCase();
            const link = `${careers24BaseURL}/jobs/${endpoint || ""}`;

            if (DEV) {
                console.log({ link });
                showToast({ msg: link });
            }
            await fetchJobs(endpoint);
        } catch (err) {
            handleErrs(err);
            showToast({
                err: true,
                msg: isTuError(err) || "Failed to apply filters",
            });
        }
    };

    return (
        <>
            <TMeta title={`Browse jobs - ${SITE}`} />
            <div className="p-4 h-full w-full">
                <div className="flex md:flex-row flex-col gap-2 justify-start items-center md:items-start md:justify-center w-full">
                    {appStore.screenSz.w >= centerElementWidth && (
                        <JobsFiltersSection
                            onApplyFilters={applyFilters}
                            filters={jobsStore.filters}
                        />
                    )}
                    <div
                        className={`p-4 oy-scroll max-h-100p rounded-sm bordered w-${centerElementWidth}px`}
                    >
                        <div className="flex gap-2 justify-between w-full items-center">
                            <h2 className="ttl">Jobs</h2>
                            {appStore.screenSz.w < centerElementWidth && (
                                <TuModal
                                    toggler={
                                        <UButton className="btn-primary btn-md">
                                            <span>
                                                <i className="fi fi-br-settings-sliders"></i>
                                            </span>
                                            &nbsp; Filters
                                        </UButton>
                                    }
                                >
                                    <JobsFiltersSection
                                        onApplyFilters={applyFilters}
                                        filters={jobsStore.filters}
                                    />
                                </TuModal>
                            )}
                        </div>

                        <div className="mt-3 flex flex-col gap-2">
                            {!jobsStore.jobs?.length ? (
                                <div className="loading-div">
                                    {!jobsStore.jobs ? (
                                        <div className="loading loading-lg loading-ring"></div>
                                    ) : (
                                        <p className="fs-18 text-center">
                                            Nothing to show
                                        </p>
                                    )}
                                </div>
                            ) : (
                                jobsStore.jobs.map((el, i) => (
                                    <JobCard key={`job-${i}`} job={el} />
                                ))
                            )}
                        </div>
                        {DEV && (
                            <UButton
                                showLoader
                                className="btn-secondary mt-3"
                                onClick={async () => await fetchJobs()}
                            >
                                Fetch jobs
                            </UButton>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default page;
