"use client"
import { careers24BaseURL } from "@/utils/consts";
import UButton from "@repo/ui-next/components/UButton";
import { DEV } from "@repo/ui-next/lib/consts";

const ApplyBtn = ({ id }: { id: string }) => {
    return (
        <UButton title={DEV && id}
            onClick={() => {
                window.open(`${careers24BaseURL}/jobs/apply/${id}`, '_blank');
            }}
            className="btn-md btn-primary fs-17 fw-5 w-full"
        >
            Apply now
        </UButton>
    );
};

export default ApplyBtn