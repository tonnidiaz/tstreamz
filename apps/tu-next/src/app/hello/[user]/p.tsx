"use client";
import TMeta from "@repo/ui-next/components/TMeta";
import UButton from "@repo/ui-next/components/UButton";
import React from "react";
import { useEffect } from "react";

const Page = ({ data }: { data: any }) => {

  
    return (
        <>
            <TMeta title={`Hello ${data.hello} | TuNextApp`} />
            <div className="p-4">
                <h1 className="ttl">Greet user: {data.hello}</h1>
            </div>
        </>
    );
};

export default Page;
