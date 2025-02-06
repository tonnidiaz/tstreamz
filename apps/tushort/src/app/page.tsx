"use client";
import LinksComponent from "@/components/LinksComponent";

export default function Home() {
    return (
        <div className="flex flex-col gap-8px p-4 w-500px m-auto">
            <LinksComponent/>
            <h1 className="title text-center">Hello Tu world</h1>
        </div>
    );
}

