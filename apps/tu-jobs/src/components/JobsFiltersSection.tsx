"use client";
import { setFilters, updateJobsState } from "@/redux/reducers/jobs";
import {
    contractTypes,
    jobSectors,
    minPrices as minSalaries,
} from "@/utils/consts";
import { IFilters } from "@/utils/interfaces";
import { formatNum } from "@cmn/utils/funcs";
import { tuImmer } from "@cmn/utils/funcs4";
import TuSelect from "@repo/ui-next/components/TuSelect";
import UButton from "@repo/ui-next/components/UButton";
import UFormGroup from "@repo/ui-next/components/UFormGroup";
import { TuState } from "@repo/ui-next/lib/interfaces";
import { useDispatch } from "react-redux";

const MinSalaryRadio = ({
    minPx,
    i,
    filters,
}: {
    minPx?: number;
    i: number;
    filters: IFilters;
}) => {
    const dispatch = useDispatch()
    return (
    <div className="flex gap-2 items-center">
        <input
            className="radio radio-sm radio-secondary"
            type="radio"
            radioGroup="min-salary"
            name="min-salary"
            id={`sal-${i}`}
            value={minPx}
            checked={minPx == filters.minSalary}
            onChange={(e) => (dispatch(updateJobsState(["filters.minSalary", minPx])))}
        />
        <label htmlFor={`sal-${i}`}>
            {!minPx ? "ANY" : formatNum(minPx, 0)}
        </label>
    </div>
)};

export default function JobsFiltersSection({
    filters,
    onApplyFilters,
}: {
    filters: IFilters;
    onApplyFilters: () => any;
}) {
    const dispatch = useDispatch()

    const addRmSector = (sect: string) => {
        const rmv = filters.sectors.includes(sect);
        if (!rmv && filters.sectors.length >= 3) return;
        const sectors = rmv
            ? filters.sectors.filter((el) => el !== sect)
            : [...filters.sectors, sect];
        dispatch(setFilters(tuImmer(filters, (cp)=> cp.sectors = sectors)))
        // dispatch(updateJobsState(["filters.s", filters]))
    };

    return (
        <div className="p-2 rounded-sm bordered filters max-h-100p flex flex-col gap-2">
            <h3 className="fs-18">Tweak your search</h3>
            <div className="mt-2 flex-1  oy-scroll">
                <div className="p-2 bordered">
                    <h4 className="ttl">Min. salary</h4>
                    <div className="mt-3">
                        <MinSalaryRadio
                            key={"sal-any"}
                            i={0}
                            filters={filters}
                        />
                        {minSalaries.map((minPx, i) => (
                            <MinSalaryRadio
                                filters={filters}
                                key={minPx}
                                minPx={minPx}
                                i={i + 1}
                            />
                        ))}
                    </div>
                </div>
                <div className="p-2 bordered mt-2 contract-types">
                    <UFormGroup label="Contact type">
                        <TuSelect
                            placeholder="Contract type"
                            value={filters.contractType}
                            onChange={(val) =>
                                (dispatch(updateJobsState(["filters.contractType", val])))
                            }
                            options={contractTypes.map((el) => ({
                                label: el,
                                value: el.toLowerCase(),
                            }))}
                        />
                    </UFormGroup>
                </div>
                <div className="p-2 bordered mt-2 max-h-300 oy-scroll sectors">
                    <h4 className="ttl mb-2 flex w-full items-center justify-between">Sectors <span className="fw-5">{filters.sectors.length} / 3</span></h4>
                    <UFormGroup
                        className="flex items-center gap-2"
                        key={`sector-any`}
                        labelClass="fs-14"
                        label={"ANY"}
                    >
                        <input
                            readOnly
                            type="checkbox"
                            checked={!filters.sectors?.length}
                            className="checkbox checkbox-sm checkbox-secondary"
                        />
                    </UFormGroup>
                    {jobSectors.map((el, i) => (
                        <UFormGroup
                            className="flex items-center gap-2"
                            key={`sector-${i}`}
                            labelClass="fs-14"
                            label={el}
                        >
                            <input
                                type="checkbox"
                                checked={filters.sectors.includes(el)}
                                onChange={(e) => addRmSector(el)}
                                className="checkbox checkbox-sm checkbox-secondary"
                            />
                        </UFormGroup>
                    ))}
                </div>
            </div>
            <UButton onClick={onApplyFilters} className="btn-primary btn-md">
                Apply filters
            </UButton>
        </div>
    );
}
