import { Metadata } from "next";
import Page from "./p";
import { CONFIG } from "@/utils/consts";
import { headers } from "next/headers";
import { getHost } from "@repo/ui-next/lib/funcs";

const title = `${CONFIG.site} - ${CONFIG.slogan}`;
export const generateMetadata: () => Promise<Metadata> = async () => {
    const url = await getHost()
    
    return {
        title,
        description: CONFIG.description,
        metadataBase: new URL(url),
        openGraph: { title, description: CONFIG.description, url },
        twitter: { title, description: CONFIG.description, url },
    };
};
const page = async () => {
    const host = await getHost();
    return <Page origin={host} />;
};

export default page;
