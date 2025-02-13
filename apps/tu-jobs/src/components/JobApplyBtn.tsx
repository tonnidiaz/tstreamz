"use client"
import UButton from "@repo/ui-next/components/UButton";
import { DEV } from "@repo/ui-next/lib/consts";

const ApplyBtn = ({ link, className }: { link: string; className?: string }) => {
    // link = "https://www.careerjunction.co.za/application/apply-link/2597806"
    const classes = "btn btn-md btn-secondary fs-17 fw-5 " + (className || '')
    return (
        // false ?<UButton title={DEV && link}
        //     onClick={() => {
        //         window.open(link, "");
        //     }}
        //     className={`${classes}`}
        // >
        //     Apply now
        // </UButton>:
        <a  className={`${classes}`} rel="noopener noreferrer" target="_blank" href={link + "?referrer=tonnidiaz"}>Apply now</a>
    );
};

export default ApplyBtn