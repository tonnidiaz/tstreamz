"use client"
import UButton from "@repo/ui-next/components/UButton";
import { DEV } from "@repo/ui-next/lib/consts";

const ApplyBtn = ({ link }: { link: string }) => {
    return (
        // <UButton title={DEV && link}
        //     onClick={() => {
        //         window.open(link, '_blank');
        //     }}
        //     className="btn-md btn-primary fs-17 fw-5 w-full"
        // >
        //     Apply now
        // </UButton>
        <a  className="btn btn-md btn-primary fs-17 fw-5 w-full" href={link + "?referrer=tonnidiaz"}>Apply now</a>
    );
};

export default ApplyBtn