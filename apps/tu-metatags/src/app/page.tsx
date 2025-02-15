import { Metadata } from "next";
import Page from "./p";
import { CONFIG } from "@/utils/consts";

export const generateMetadata: () => Promise<Metadata> = async () =>{
    return {title: `${CONFIG.site}`}
}
const page = () => {
    return ( <Page/> );
}
 
export default page;