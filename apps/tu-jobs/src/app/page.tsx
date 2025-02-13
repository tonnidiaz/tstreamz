"use client";

import { SITE } from "@/utils/consts";

export default function Home() {
    return (
        <div className="flex flex-col gap-8px p-4 w-500px m-auto">
            <h1 className="title text-center">{SITE}</h1>
        </div>
    );
}

