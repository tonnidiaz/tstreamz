"use server"

import { getHost } from "@repo/ui-next/lib/funcs";
import TuLayout from "./Layout";
import { ReactNode } from "react";

const TuRootLayout = async ({children} : {children: ReactNode}) => {
    return ( <TuLayout>{children}</TuLayout> );
}
 
export default TuRootLayout;