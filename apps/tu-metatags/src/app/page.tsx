import { Metadata } from "next";
import Page from "./p";
import { CONFIG } from "@/utils/consts";
import { headers } from "next/headers";
import { getHost } from "@repo/ui-next/lib/funcs";

export const generateMetadata: () => Promise<Metadata> = async () =>{
    return {title: `${CONFIG.site}`}
}
const page =async () => {
    const host = await getHost()
    return ( <Page origin={host}/> );
}
 
export default page;