import "preline/preline";
import "@mobile/ui-next/styles/main.scss";
import "@/styles/main.scss";
import { useEffect, useMemo, useRef, useState } from "react";

import { handleErrs, parseDate, timedLog } from "@cmn/utils/funcs";
import { getBaseDir, getFilename } from "@cmn/utils/funcs4";
import { GenThumbnails, ImportVideo, FileExists } from "wailsjs/go/main/App";
import { WindowSetTitle, WindowUnfullscreen } from "wailsjs/runtime/runtime";
import videojs from "video.js";
import { VideoJS } from "@/components/VideoJs";
import { useDispatch, useSelector } from "react-redux";
import { updateAppState } from "@/redux/reducers/app";
import { RootState } from "@/redux/store";
import TuPlayer from "@/components/TuPlayer";
import { playerStateActions, setCurrentFile } from "@/redux/reducers/player";
import { parseFilename } from "@/lib/funcs";

const HomePage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const appState = useSelector((s: RootState) => s.app);

    const dispatch = useDispatch();
    const state = useSelector((s: RootState) => s.player);

    const [otherVids, setOtherVids] = useState<
        { filename: string; thumb: string; size: number; modifiedAt: number }[]
    >([]);

    const playerRef = useRef<HTMLVideoElement>(null);
    const videoContRef = useRef<HTMLDivElement>(null);
    const filesURL = useMemo(
        () => `http://localhost:${appState.port}/files`,
        [appState.port]
    );

    const genSrc = (file: string) => {
        return `${filesURL}?path=${encodeURIComponent(parseFilename(file))}`;
    };

    const src = useMemo(
        () => genSrc(state.currentFile),
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
                    console.log("\nHere");
                    dispatch(setCurrentFile(currFile + "#"));
                }
            }
        } catch (er) {}
    }

    useEffect(() => {
        checkAndSetCurrentFileFromArgs();

        return () => {
            WindowUnfullscreen();
        };
    }, []);

    useEffect(() => {
        console.log("\nCFILE", state.currentFile);
        dispatch(
            playerStateActions.setPlaylist(otherVids.map((el) => el.filename))
        );
    }, [otherVids]);

    useEffect(() => {
        // state.currentFile
        let { currentFile } = state;
        const cFile = currentFile;
        if (currentFile) {
            currentFile = parseFilename(currentFile);
            dispatch(
                updateAppState({
                    path: "title",
                    value: getFilename(currentFile),
                })
            );

            if (cFile.endsWith("#")) setupOtherVideos(currentFile);
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
                const elToScroll = el as HTMLDivElement;
                elToScroll.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                });
            }
        }
    }, [state.currentFile, otherVids]);

    return (
        <>
            {appState.port ? (
                <div ref={pageRef} className="flex-col gap-4 h-full">
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
                    <div className="flex gap-2 items-start w-full h-full">
                        <div
                            id="video-cont"
                            ref={videoContRef}
                            className="flex-1 bg-card relative rounded-md w-full h-full flex items-center justify-center flex-col p-2"
                        >
                            <div
                                className="flex items-center justify-center w-full h-full"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                }}
                            >
                                <button
                                    onClick={() => {
                                        dispatch(
                                            playerStateActions.importVideo()
                                        );
                                    }}
                                    className="fs-40"
                                >
                                    <i className="fi fi-rr-add"></i>
                                </button>
                            </div>
                            {state.useVideoJs ? null : (
                                <TuPlayer
                                    currIndex={state.currentIndex}
                                    playlist={state.playlist?.map(genSrc)}
                                    onIndexChange={(val) => {
                                        // console.log(`[on_index] ${val}`);
                                        dispatch(
                                            playerStateActions.setCurrentIndex(
                                                val
                                            )
                                        );
                                    }}
                                />
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
                        {!otherVids.length ? null : (
                            <div className="w-250px p-2 rounded-md border-1 border-neutral-800 flex flex-col max-h-full">
                                <div className="my-2 px-2">
                                    <h3 className="text-md">Playlist</h3>
                                </div>
                                <div className="oy-scroll flex-1">
                                    {otherVids.map((el, i) => (
                                        <div
                                            style={{ cursor: "pointer" }}
                                            title={getFilename(el.filename)}
                                            onClick={() =>
                                                dispatch(
                                                    playerStateActions.setCurrentIndex(
                                                        i
                                                    )
                                                )
                                            }
                                            key={`Item${i + 1}`}
                                            className={
                                                "tu-menu-item p-2 flex gap-1 items-start vid-card-cont " +
                                                (state.currentIndex == i &&
                                                    "active")
                                            }
                                        >
                                            <div className="h-50px w-50px">
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
                                            <h4 className="_title fs-12 max-lines-2 ellipsis wp-wrap">
                                                {getFilename(el.filename)}
                                            </h4>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
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
