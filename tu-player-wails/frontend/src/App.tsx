import { useEffect, useMemo, useRef, useState } from "react";
import UButton from "@repo/ui-next/components/UButton";
import "@repo/ui/styles/tw.css";
import "@/styles/tw.css";
import "@repo/ui/styles/all.scss";
import "@/styles/main.scss";
import "@flaticon/flaticon-uicons/css/all/all.css";
import Titlebar from "./components/Titlebar";
import { handleErrs } from "@cmn/utils/funcs";

import { getBaseDir, getFilename, tuImmer } from "@cmn/utils/funcs4";
import { GenThumbnails, GetPort, ImportVideo } from "../wailsjs/go/main/App";
import { WindowSetTitle } from "wailsjs/runtime/runtime";
import videojs from "video.js";
import { VideoJS } from "./components/VideoJs";
import {useDispatch} from 'react-redux'
import { updateAppState } from "./redux/reducers/app";

function App() {
    const [, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const [state, setState] = useState<{ currentFile?: string; port?: number, useVideoJs?: boolean }>(
        {}
    );
    const [otherVids, setOtherVids] = useState<
        { filename: string; thumb: string }[]
    >([]);
    const playerRef = useRef<HTMLVideoElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch()
    const filesURL = useMemo(
        () => `http://localhost:${state.port}/files`,
        [state.port]
    );

    const src = useMemo(
        () => `${filesURL}?path=${encodeURIComponent(state.currentFile)}`,
        [filesURL, state.currentFile]
    );
    const videoJsOptions = useMemo(
        () => ({
            autoplay: true,
            controls: true,
            responsive: true,
            fluid: true,
            sources: [
                {
                    src,
                    type: `video/${src.split(".").pop()}`,
                },
            ],
        }),
        [state.currentFile, src]
    );

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        // You can handle player events here, for example:
        player.on("waiting", () => {
            videojs.log("player is waiting");
        });

        player.on("dispose", () => {
            videojs.log("player will dispose");
        });
    };

    useEffect(() => {
        try {
            GetPort()
                .then((r) => {
                    setState((state) =>
                        tuImmer(state, (state) => (state.port = r))
                    );
                })
                .catch(handleErrs);
        } catch (err) {
            handleErrs(err);
            setState((s) => ({ ...s, port: 45874 }));
        }
    }, []);
    useEffect(() => {
        const { currentFile } = state;
        if (currentFile) {
            if (playerRef.current) {
                playerRef.current.pause();
                playerRef.current.load();
                playerRef.current.play();
            }
            const filename = getFilename(currentFile)
            WindowSetTitle(filename);
            dispatch(updateAppState({path: 'title', value: filename})) 
        }
    }, [state.currentFile]);

    useEffect(() => {
        if (state.currentFile && otherVids.length) {
            // Scroll active video-cont element to view
            const el: HTMLDivElement = pageRef.current.querySelector(
                ".vid-card-cont.active"
            );
            if (el) {
                ((el.nextSibling || el) as HTMLDivElement).scrollIntoView({behavior: "smooth"});
            }
        }
    }, [state.currentFile, otherVids]);
    async function init() {
        try {
            // Get the HTTP port from Go
            // GetPort()
        } catch (err) {
            handleErrs(err);
        }
    }

    async function pickVideo() {
        try {
            const res = await ImportVideo();
            if (res) {
                setState((s) => tuImmer(s, (s) => (s.currentFile = res)));
                // Read other files in directory
                const dir = getBaseDir(res);
                GenThumbnails(dir).then(setOtherVids);
            }
        } catch (err) {
            handleErrs(err);
        }
    }

    return (
        <>
            <div ref={pageRef} className="flex-col h-full w-full">
                <Titlebar />
                <div className="tu-app">
                    {state.port ? (
                        <div className="p-4 flex-col gap-4 h-full oy-scroll">
                            <div>
                                <div className="my-2">
                                    <p className="text-primary text-center fw-6">
                                        PORT:{state.port}
                                    </p>
                                </div>
                                {state.currentFile && (
                                    <h1 className="text-center fs-16 fw-6 max-lines-2 ellipsis">
                                        {getFilename(state.currentFile)}
                                    </h1>
                                )}
                            </div>

                            <div
                                id="video-cont"
                                className="bg-card rounded-md w-full h-500px rounded-md flex items-center justify-center flex-col p-2"
                            >
                                {state.useVideoJs ? null :<video
                                    ref={playerRef as any}
                                    disablePictureInPicture
                                    controls
                                >
                                    {state.currentFile && (
                                        <source
                                            src={src}
                                        />
                                    )}
                                </video>}
                                {state.currentFile && state.useVideoJs ? (
                                    <VideoJS
                                        options={{
                                            autoplay: true,
                                            controls: true,
                                            responsive: true,
                                            fluid: true,
                                            sources: [{
                                              src,
                                              type: `video/${src.split(".").pop().toLowerCase()}`
                                            }]
                                          }}
                                        onReady={handlePlayerReady}
                                    />
                                ) : null}
                            </div>

                            <UButton
                                onClick={pickVideo}
                                className="btn-md btn-success"
                            >
                                Pick video
                            </UButton>
                            {otherVids.length ? (
                                <section>
                                    <h3 className="ttl">Playlist</h3>
                                    <div className="mt-3 p-2 flex ox-scroll gap-3">
                                        {otherVids.map((el, i) => (
                                            <div
                                                title={getFilename(el.filename)}
                                                onClick={() =>
                                                    setState((s) =>
                                                        tuImmer(
                                                            s,
                                                            (s) =>
                                                                (s.currentFile =
                                                                    el.filename)
                                                        )
                                                    )
                                                }
                                                key={`vid-${i}`}
                                                className={
                                                    "vid-card-cont " +
                                                    (state.currentFile ==
                                                        el.filename && "active")
                                                }
                                            >
                                                <div className="vid-card rounded-md flex items-center justify-center flex-col">
                                                    <img
                                                        src={
                                                            `${filesURL}?path=` +
                                                            encodeURIComponent(
                                                                el.thumb
                                                            )
                                                        }
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="p-2">
                                                    <h4 className="_title fs-14 max-lines-2 ellipsis wp-wrap">
                                                        {getFilename(
                                                            el.filename
                                                        )}
                                                    </h4>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ) : null}
                        </div>
                    ) : (
                        <div className="loading-div">
                            <span className="w-70px loading loading-lg loading-xl loading-ring"></span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default App;
