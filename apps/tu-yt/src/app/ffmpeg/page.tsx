"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import UButton from "@repo/ui-next/components/UButton";
import UInput from "@repo/ui-next/components/UInput";
import { useState, useRef, useEffect } from "react";

const page = () => {
    const [url, setUrl] = useState("https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm")
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);
    const messageRef = useRef(null);

    const load = async () => {
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on("log", ({ message }) => {
            messageRef.current.innerHTML = message;
            console.log(message);
        });
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
            coreURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.js`,
                "text/javascript"
            ),
            wasmURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.wasm`,
                "application/wasm"
            ),
        });
        setLoaded(true);
    };

    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
        await ffmpeg.writeFile(
            "input.webm",
            await fetchFile(
                url
            )
        );
        await ffmpeg.exec(["-i", "input.webm", "output.mp4"]);
        const data = await ffmpeg.readFile("output.mp4");
        videoRef.current.src = URL.createObjectURL(
            new Blob([(data as any).buffer], { type: "video/mp4" })
        );
    };

    useEffect(()=>{
        const ffmpeg = ffmpegRef.current
        console.log({isLoaded: ffmpeg.loaded});
    }, [ffmpegRef.current])

    return (
        <div className="p-4">
            <div className="my-4">
                <UInput value={url} onChange={({target})=> setUrl(target.value)}/>
            </div>
            {loaded ? (
                <>
                    <video ref={videoRef} controls></video>
                    <br />
                    <UButton className="btn-primary" onClick={transcode}>
                        Transcode webm to mp4
                    </UButton>
                    <p ref={messageRef}></p>
                    <p>Open Developer Tools (Ctrl+Shift+I) to View Logs</p>
                </>
            ) : (
                <UButton className="btn-primary" onClick={load}>
                    Load ffmpeg-core (~31 MB)
                </UButton>
            )}
        </div>
    );
};

export default page;
