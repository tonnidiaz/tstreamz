import { cookies } from "next/headers";
import Page from "./p";
import { Suspense, use } from "react";

const page = async () => {
    return (<Page/>);
}
 
export default page;