"use client";
import { app, filesystem } from "@neutralinojs/lib";
import Image from "next/image";
import { useEffect } from "react";
import { useTuState } from "@repo/ui-next/lib/hooks";
import { getFileSz } from "@/lib/server/funcs";

const videoPath =
    "/home/tonni/Downloads/The Simpsons S01-S30 (1989-) + Shorts (1987-1989) + Movie (2007)/The Simpsons S02 (360p re-dvdrip)/The Simpsons S02E03 Treehouse of Horror.mp4";
const videoFile =
    "/home/tonni/Downloads/The Simpsons S01-S30 (1989-) + Shorts (1987-1989) + Movie (2007)/The Simpsons S04 (360p re-dvdrip)/The Simpsons S04E14 Brother From the Same Planet.mp4";
export default function Home() {
    const allowed = useTuState<string[]>([]);
    const sz = useTuState(0);
    const src = useTuState("http://localhost:45875/files?path=%2FUSB%2FPurple_Hearts_(2022)_(NetNaija.com)_(1).mp4");

    useEffect(() => {
        (async function () {
            const config = await app.getConfig();
            allowed.value = config.nativeAllowList;
            sz.value = await getFileSz(videoPath);
        })();
    }, []);
    return (
        <div className="h-full oy-scroll">
            <h1>Hell Tu world</h1>
            <div className="mt-4">
                {/* <video src={`${window.location.origin}/api/file/${encodeURIComponent(src.value)}`} controls></video> */}
            </div>
            <div className="mt-4">
                <h3>Allowed apis</h3>
                <ol>
                    {allowed.value.map((el) => (
                        <li key={el}>{el}</li>
                    ))}
                </ol>
            </div>
            <div className="my-4">
                <p>Size: {(sz.value / 1000 / 1024).toFixed(2)} mb</p>
            </div>
            <div>
                <div
                    style={{ display: "flex", flexDirection: "column", gap: 5 }}
                    className="flex flex-col"
                >
                    <video
                        playsInline
                        style={{ background: "black", width: 400, height: 200 }}
                        controls
                    >
                        <source
                            src={src.value}
                        />
                    </video>
                  
                </div>
            </div>
        </div>
    );
}
