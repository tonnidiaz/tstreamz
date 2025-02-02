"use client";
import JobCard from "@/components/JobCard";
import { forceFetchJobs, jobSectors } from "@/utils/consts";
import { IJob } from "@/utils/interfaces";
import { scrapeJobs } from "@/utils/server/scraper";
import { formatNum } from "@cmn/utils/funcs";
import TuSelect from "@repo/ui-next/components/TuSelect";
import UAccordion from "@repo/ui-next/components/UAccordion";
import UButton from "@repo/ui-next/components/UButton";
import UCheckbox from "@repo/ui-next/components/UCheckbox";
import UFormGroup from "@repo/ui-next/components/UFormGroup";
import { DEV } from "@repo/ui-next/lib/consts";
import { useTuState } from "@repo/ui-next/lib/hooks";
import { useEffect } from "react";

const jobsStorageKey = "jobs";
const getSavedJobs = () => {
    return localStorage.getItem(jobsStorageKey);
};

const page = () => {
    const filters = useTuState<{ contractType?: string; minSalary?: number; sectors: string[] }>(
        {sectors: []}
    );

    const jobs = useTuState<IJob[] | null>();
    const fetchJobs = async () => {
        jobs.value = null;
        const savedJobs = getSavedJobs();
        jobs.value =
            savedJobs && !forceFetchJobs
                ? JSON.parse(savedJobs)
                : await scrapeJobs();
    };

    useEffect(() => {
        // fetchJobs()
    }, []);

    useEffect(() => {
        if (jobs.value?.length && DEV) {
            localStorage.setItem(jobsStorageKey, JSON.stringify(jobs.value));
        }
    }, [jobs]);

    const minPrices = [1, 2, 3, 4].map((el) => el * 12000);
    const contractTypes = [
        "Permenent",
        "Part-Time",
        "Contract",
        "Temporary",
        "Internship",
    ];

    const MinSalaryRadio = ({ minPx, i }: { minPx?: number; i: number }) => (
        <div className="flex gap-2 items-center">
            <input
                className="radio radio-sm radio-secondary"
                type="radio"
                radioGroup="min-salary"
                name="min-salary"
                id={`sal-${i}`}
                value={minPx}
                checked={minPx == filters.value.minSalary}
                onChange={e=> filters.value.minSalary = minPx}
            />
            <label htmlFor={`sal-${i}`}>
                {!minPx ? "ANY" : formatNum(minPx, 0)}
            </label>
        </div>
    );

    const addRmSector = (sect: string) => { 
        const rmv = filters.value.sectors.includes(sect)
            filters.value.sectors = rmv ? filters.value.sectors.filter(el=> el !== sect) : [...filters.value.sectors, sect]
     }

    return (
        <div className="p-4 flex gap-2 items-start justify-center w-full">
            <div className="p-2 rounded-sm bordered">
                <h3 className="fs-18">Tweak your search</h3>
                <div className="mt-4">
                    <div className="p-2 bordered">
                        <h4 className="ttl">Min. salary</h4>
                        <div className="mt-3">
                            <MinSalaryRadio key={"sal-any"} i={0} />
                            {minPrices.map((minPx, i) => (
                                <MinSalaryRadio
                                    key={minPx}
                                    minPx={minPx}
                                    i={i + 1}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="p-2 bordered mt-2">
                        <UFormGroup label="Contact type">
                            <TuSelect
                                placeholder="Contract type"
                                value={filters.value.contractType}
                                onChange={val=>filters.value.contractType = val}
                                options={contractTypes.map((el) => ({
                                    label: el,
                                    value: el.toLowerCase(),
                                }))}
                            />
                        </UFormGroup>
                    </div>
                    <div className="p-2 bordered mt-2 max-h-300 oy-scroll">
                        <h4 className="ttl mb-2">Sectors</h4>
                        <UFormGroup
                                className="flex items-center gap-2"
                                key={`sector-any`}
                                labelClass="fs-14"
                                label={"ANY"}
                            >
                                <input readOnly type="checkbox" checked={!filters.value.sectors?.length} className="checkbox checkbox-sm checkbox-secondary" />
                            </UFormGroup>
                        {jobSectors.map((el, i) => (
                            <UFormGroup
                                className="flex items-center gap-2"
                                key={`sector-${i}`}
                                labelClass="fs-14"
                                label={el}
                            >
                                <input type="checkbox" checked={filters.value.sectors.includes(el)} onChange={e=> addRmSector(el)} className="checkbox checkbox-sm checkbox-secondary" />
                            </UFormGroup>
                        ))}
                    </div>
                </div>
            </div>
            <div className="p-4 oy-scroll max-h-100p rounded-sm bordered w-500px">
                <h2 className="ttl">Jobs</h2>
                <div className="mt-3 flex flex-col gap-2">
                    {!jobs.value?.length ? (
                        <div className="loading-div">
                            {!jobs.value ? (
                                <div className="loading loading-lg loading-bars"></div>
                            ) : (
                                <p className="fs-18 text-center">
                                    Nothing to show
                                </p>
                            )}
                        </div>
                    ) : (
                        jobs.value.map((el, i) => (
                            <JobCard key={`job-${i}`} job={el} />
                        ))
                    )}
                </div>
                {DEV && (
                    <UButton className="btn-secondary mt-3" onClick={fetchJobs}>
                        Fetch jobs
                    </UButton>
                )}
            </div>
        </div>
    );
};

export default page;
