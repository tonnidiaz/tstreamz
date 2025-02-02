import { IJob } from "@/utils/interfaces";

const JobCard = ({ job }: { job: IJob }) => {
    return (
        <div className="job-card border-card border-1 p-3">
            <h2 className="fs-18 fw-6">{job.title}</h2>
            <div
                className="job-meta"
                dangerouslySetInnerHTML={{
                    __html: job.meta,
                }}
            ></div>
        </div>
    );
};

export default JobCard;
