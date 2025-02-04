import { genJobId } from "@/utils/funcs";
import { IJobExt } from "@/utils/interfaces";
import TuLink from "@repo/ui-next/components/TuLink";

const JobCard = ({ job }: { job: IJobExt }) => {
    return (
        <TuLink to={`/jobs/job/${job.id}`} className="tu-job-card border-card border-1 p-3">
            <h2 className="fs-18 fw-6">{job.title}</h2>
            <div
                className="tu-job-meta"
                dangerouslySetInnerHTML={{
                    __html: job.meta,
                }}
            ></div>
        </TuLink>
    );
};

export default JobCard;
