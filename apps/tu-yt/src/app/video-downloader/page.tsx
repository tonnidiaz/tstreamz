import { SITE } from "@/utils/consts";
import TMeta from "@repo/ui-next/components/TMeta";
import UButton from "@repo/ui-next/components/UButton";
import UFormGroup from "@repo/ui-next/components/UFormGroup";
import UInput from "@repo/ui-next/components/UInput";
import Page from "./p";

const page = () => {
    return (
        <>
            <TMeta title={`YT video downloader - ${SITE}`} />
            <Page />
        </>
    );
};

export default page;
