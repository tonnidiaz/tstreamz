"use client"
import UButton from "@repo/ui-next/components/UButton";
import { DEV } from "@repo/ui-next/lib/consts";

const ApplyBtn = ({ link }: { link: string }) => {
    // link = "https://www.careerjunction.co.za/application/apply-link/2597806"
    return (
        false ?<UButton title={DEV && link}
            onClick={() => {
                window.open(link, "");
            }}
            className="btn-md btn-primary fs-17 fw-5 w-full"
        >
            Apply now
        </UButton>:
        <a  className="btn btn-md btn-primary fs-17 fw-5 w-full" rel="noopener noreferrer" target="_blank" href={link + "?referrer=tonnidiaz"}>Apply now</a>
    );
};

export default ApplyBtn