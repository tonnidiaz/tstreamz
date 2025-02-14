import { Metadata } from "next";
import Page from "./p";

export const generateMetadata: () => Promise<Metadata> = async () =>{
    return {title: "Tu metadata tool - Tu"}
}
const page = () => {
    return ( <Page/> );
}
 
export default page;