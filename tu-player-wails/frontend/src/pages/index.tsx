import "preline/preline";
import "@mobile/ui-next/styles/main.scss";
import "@/styles/main.scss";
import { useEffect, useMemo, useRef, useState } from "react";

import { handleErrs, sleep, timedLog } from "@cmn/utils/funcs";
import { getBaseDir, getFilename, tuImmer } from "@cmn/utils/funcs4";
import { GenThumbnails, ImportVideo, FileExists } from "wailsjs/go/main/App";
import { WindowSetTitle } from "wailsjs/runtime/runtime";
import videojs from "video.js";
import { VideoJS } from "@/components/VideoJs";
import { useDispatch, useSelector } from "react-redux";
import { updateAppState } from "@/redux/reducers/app";
import { TuButton } from "@mobile/ui-next/components";
import { RootState } from "@/redux/store";
import { setPlayerState } from "@/redux/reducers/player";

const HomePage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const appState = useSelector((s: RootState) => s.app);

    const dispatch = useDispatch();
    const state = useSelector((s: RootState) => s.player);

    const [otherVids, setOtherVids] = useState<
        { filename: string; thumb: string }[]
    >([]);
    const playerRef = useRef<HTMLVideoElement>(null);
    const videoContRef = useRef<HTMLDivElement>(null);
    const filesURL = useMemo(
        () => `http://localhost:${appState.port}/files`,
        [appState.port]
    );

    const src = useMemo(
        () => `${filesURL}?path=${encodeURIComponent(state.currentFile)}`,
        [filesURL, state.currentFile]
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

    function setupOtherVideos(filepath: string) {
        // Read other files in directory
        const dir = getBaseDir(filepath);
        GenThumbnails(dir).then(setOtherVids);
    }

    async function checkAndSetCurrentFileFromArgs() {
        try {
            const { args } = appState;
            timedLog("[home_page]", { args });
            if (args.length) {
                const currFile = args[0];
                if (await FileExists(currFile)) {
                    dispatch(
                        setPlayerState({ path: "currentFile", value: currFile })
                    );
                }
            }
        } catch (er) {}
    }

    async function pickVideo() {
        try {
            const res = await ImportVideo();
            if (res) {
                dispatch(setPlayerState({ path: "currentFile", value: res }));
            }
        } catch (err) {
            handleErrs(err);
        }
    }

    useEffect(() => {
        checkAndSetCurrentFileFromArgs();
    }, []);

    useEffect(() => {
        // state.currentFile
        const { currentFile } = state;
        if (currentFile) {
            dispatch(
                updateAppState({
                    path: "title",
                    value: getFilename(currentFile),
                })
            );
            setupOtherVideos(currentFile);
            if (state.useVideoJs) {
                // playerRef.current.play().then(()=>{
                //     console.log('[vidjs] playing');
                // }).catch(er=>{console.log('[vidjs] Failed to play video', er);})
                return;
            }

            if (playerRef.current) {
                // console.log(playerRef.current);
                playerRef.current.pause();
                playerRef.current.load();
                playerRef.current.oncanplay = (e)=>{
                    timedLog("Player can play")
                    playerRef.current.play().then(()=> timedLog("Player play")).catch(console.log)
                }
            }

            // // Remove old video from container
            // const oldVid = videoContRef.current.querySelector("video");
            // if (oldVid) {
            //     oldVid.pause();
            //     oldVid.remove();
            // }

            // Create new video element
            // const vid = document.createElement("video");
            // vid.controls = true;
            // vid.src = src;
            // vid.autoplay = true;
            // // vid.muted = true;
            // videoContRef.current.appendChild(vid);
            // // Add listeners to the video
            // vid.oncanplay = (e) => {
            //     console.log(`[VID] Can play`);
            //     vid.play()
            //         .then(async () => {
            //             timedLog("Video playing...");
            //             // await sleep(1000);
            //             // vid.muted = false;
            //             // vid.volume = 1;
            //             // vid.play();
            //         })
            //         .catch((err) => {
            //             console.log("Failed to play vid");
            //             handleErrs(err);
            //         });
            // };

            const filename = getFilename(currentFile);
            WindowSetTitle(filename);
            dispatch(updateAppState({ path: "title", value: filename }));
        }
    }, [state.currentFile]);

    useEffect(() => {
        // state.currentFile, otherVids
        if (state.currentFile && otherVids.length) {
            // Scroll active video-cont element to view
            const el: HTMLDivElement = pageRef.current.querySelector(
                ".vid-card-cont.active"
            );
            if (el) {
                const elToScroll = (el.nextSibling || el) as HTMLDivElement;
                elToScroll.scrollTo({ left: 0, behavior: "smooth" });
                // elToScroll.scrollIntoView({
                //     behavior: "smooth",block: 'nearest', inline: 'center'
                // });
            }
        }
    }, [state.currentFile, otherVids]);

    return (
        <>
            {appState.port ? (
                <div
                    ref={pageRef}
                    className="p-4 flex-col gap-4 h-full oy-scroll"
                >
                    <div className="hidden">
                        <div className="my-2">
                            <p className="text-primary text-center fw-6">
                                PORT:{appState.port}
                            </p>
                        </div>
                        {state.currentFile && (
                            <h1 className="text-center fs-14 fw-6 max-lines-2 ellipsis">
                                {getFilename(state.currentFile)}
                            </h1>
                        )}
                    </div>

                    <div
                        id="video-cont"
                        ref={videoContRef}
                        className="bg-card rounded-md w-full h-500px flex items-center justify-center flex-col p-2"
                    >
                        <div
                            className="flex items-center justify-center w-full h-full"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                            }}
                        >
                            <button onClick={pickVideo} className="fs-40">
                                <i className="fi fi-rr-add"></i>
                            </button>
                        </div>
                        {state.useVideoJs || !state.currentFile ? null : (
                            <video
                                autoPlay
                                ref={playerRef as any}
                                controls
                            >
                                {state.currentFile && <source src={src} />}
                            </video>
                        )}
                        {state.currentFile && state.useVideoJs ? (
                            <VideoJS
                                options={{
                                    autoplay: true,
                                    controls: true,
                                    responsive: true,
                                    fluid: true,
                                    sources: [
                                        {
                                            src,
                                            type: `video/${state.currentFile.split(".").pop().toLowerCase()}`,
                                        },
                                    ],
                                }}
                                onReady={handlePlayerReady}
                            />
                        ) : null}
                    </div>

                    {otherVids.length ? (
                        <section>
                            <h3 className="ttl">Playlist</h3>
                            <div className="mt-3 p-2 flex ox-scroll gap-3 relative">
                                {otherVids.map((el, i) => (
                                    <div
                                        title={getFilename(el.filename)}
                                        onClick={() =>
                                            dispatch(
                                                setPlayerState({
                                                    path: "currentFile",
                                                    value: el.filename,
                                                })
                                            )
                                        }
                                        key={`vid-${i}`}
                                        className={
                                            "vid-card-cont " +
                                            (state.currentFile == el.filename &&
                                                "active")
                                        }
                                    >
                                        <div className="vid-card rounded-md flex items-center justify-center flex-col">
                                            <img
                                                src={
                                                    `${filesURL}?path=` +
                                                    encodeURIComponent(el.thumb)
                                                }
                                                alt=""
                                            />
                                        </div>
                                        <div className="p-2">
                                            <h4 className="_title fs-14 max-lines-2 ellipsis wp-wrap">
                                                {getFilename(el.filename)}
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
        </>
    );
};

export default HomePage;
