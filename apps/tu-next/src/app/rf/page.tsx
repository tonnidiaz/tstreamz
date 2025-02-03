"use client";

import ReduxComp from "@/components/rf/ReduxComp";
import TMeta from "@repo/ui-next/components/TMeta";



const page = () => {

    return (
        <>
            <TMeta title="Research Facility"/>
            <div className="p-4 flex flex-col w-full h-full gap-3">
                <ReduxComp/>
            </div>
        </>
    );
};

export default page;
