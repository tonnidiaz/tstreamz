import { setPlayerState } from "@/redux/reducers/player";
import { formatDuration, sleep, timedLog } from "@cmn/utils/funcs";
import TuSlider from "@repo/ui-next-preline/components/TuSlider";
import TuIcon from "@repo/ui-next/components/TuIcon";
import { useTuState } from "@repo/ui-next/lib/hooks";
import {
    WindowFullscreen,
    WindowIsFullscreen,
    WindowUnfullscreen,
} from "@wailsjs/runtime/runtime";
import { useEffect, useRef, useState } from "react";

let mouseLastMoveAt = Date.now();
type PlayerListener = (el: HTMLVideoElement) => any;

const initPlayerState = {
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    isEnded: false,
    isReady: false,
    repeat: false,
    fullScreen: false,
    muted: false,
    volume: 100 / 100,
};

const TuPlayer = ({
    onPlay,
    onProgress,
    onPause,
    onEnded,
    onReady,
    onDurationChange,
    src,
}: {
    src?: string;
    onProgress?: (val: number) => any;
    onDurationChange?: (val: number) => any;
    onEnded?: PlayerListener;
    onPlay?: PlayerListener;
    onPause?: PlayerListener;
    onReady?: PlayerListener;
}) => {
    const playerRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<HTMLDivElement>(null);

    const [state, setState] = useState(initPlayerState);

    // Player listeners
    function _onPlayerReady(e: any) {
        const player = playerRef.current;
        setState((s) => ({ ...s, isReady: true }));
        onReady?.(player);

        player
            .play()
            .then(() => console.log(`\n[playing]...`))
            .catch(console.log);
    }
    function _onPlayerPlaying(e: any) {
        const player = playerRef.current;
        setState((s) => ({ ...s, isPlaying: true, isReady: true }));
        onPlay?.(player);
    }
    function _onPlayerDurationChange(e: any) {
        const player = playerRef.current;
        setState((s) => ({ ...s, duration: player.duration }));
        onDurationChange?.(player.duration);
    }
    function _onPlayerProgress(e: any) {
        const player = playerRef.current;
        setState((s) => ({ ...s, currentTime: player.currentTime }));
        onProgress?.(player.currentTime);
    }

    function _onPlayerPaused(e: any) {
        const player = playerRef.current;
        setState((s) => ({ ...s, isPlaying: false }));
        onPause?.(player);
    }
    function _onVolumeChange() {
        setState((s) => ({ ...s, volume: playerRef.current.volume }));
    }
    function _onPlayerEnded(e: any) {
        timedLog("[player_ended]")
        const player = playerRef.current;
        setState((s) => ({ ...s, isPlaying: false }));
        onEnded?.(player);
    }
    const togglePlay = (e) => {
        const player = playerRef.current;
        if (player) {
            if (state.isPlaying) player.pause();
            else player.play();
        }
    };

    const toggleFullScreen = async () => {
        try {
            const isFullScreen = await WindowIsFullscreen();
            if (isFullScreen) WindowUnfullscreen();
            else WindowFullscreen();
            setState((s) => ({ ...s, fullScreen: !isFullScreen }));
        } catch (err) {
            console.log(err);
        }
    };

    const showControls = (e) => {
        if (!controlsRef.current.classList.contains("active"))
            controlsRef.current.classList.add("active");
        setTimeout(() => hideControls(), 3000);
    };
    const hideControls = async (force?: boolean) => {
        // console.log({mouseLastMoveAt});
        if (force || Date.now() - mouseLastMoveAt >= 3 * 1000) {
            // console.log("\nhidding controls...");
            controlsRef.current.classList.remove("active");
        } else {
            await sleep(500);
            return await hideControls(force);
        }
    };

    useEffect(() => {
        return () => {
            WindowUnfullscreen();
        };
    }, []);
    useEffect(() => {
        if (src && playerRef.current) {
            // console.log(playerRef.current);
            playerRef.current.pause();
            playerRef.current.load();
            // playerRef.current.onplaying = _onPlayerPlaying;
            // playerRef.current.onpause = _onPlayerPaused;
            // playerRef.current.onended = _onPlayerEnded;
            // playerRef.current.ondurationchange = _onPlayerDurationChange;
            // playerRef.current.ontimeupdate = _onPlayerProgress;
            // playerRef.current.oncanplay = _onPlayerReady;
        }
    }, [src, playerRef.current]);

    useEffect(()=>{
        playerRef.current.muted = state.muted
    }, [state.muted])

    function _onVolumeWheel(ev: any) {
        try {
            ev.preventDefault();
            ev.stopPropagation();
            const player = playerRef.current;
            const _ev = ev as WheelEvent;

            const volumeDiff = 5 / 100;
            const nextVol = player.volume + volumeDiff;
            const prevVol = player.volume - volumeDiff;

            if (_ev.deltaY < 0) playerRef.current.volume = Math.min(1, nextVol);
            else playerRef.current.volume = Math.max(0, prevVol);
        } catch (err) {}
    }
    
    function _toggleMute(ev: any){
        const player = playerRef.current
        setState(s=> ({...s, muted: !player.muted}))
    }

    function _onWaiting(){
        setState(s=> ({...s, isReady: false}))
    }
    return (
        <div
            className={
                "w-full h-full z-10 flex flex-col gap-2 " +
                (state.fullScreen ? ` fixed top-0 left-0 z-50` : "")
            }
            style={{ backgroundColor: "inherit !important" }}
        >
            <div className="flex-1 overflow-hidden relative">
                {/* <div className="bg-red-500 w-full z-10 flex items-center justify-center border-1 border-neutral-50" style={{height: 600, backgroundColor: "red"}}>
                    <h3>Centered</h3>
                </div> */}
                <video
                    className="max-h-full"
                    autoPlay
                    ref={playerRef as any}
                    onPlaying={_onPlayerPlaying}
                    onPause={_onPlayerPaused}
                    onEnded={_onPlayerEnded}
                    onDurationChange={_onPlayerDurationChange}
                    onTimeUpdate={_onPlayerProgress}
                    onCanPlay={_onPlayerReady}
                    onVolumeChange={_onVolumeChange}
                    onWaiting={_onWaiting}
                >
                    {src && <source src={src} />}
                </video>
                <div
                    style={{ zIndex: 2 }}
                    ref={controlsRef}
                    onMouseEnter={showControls}
                    onMouseMove={(e) => {
                        mouseLastMoveAt = Date.now();
                        showControls(e);
                    }}
                    onMouseLeave={() => hideControls(true)}
                    className="tu-player-controls text-white absolute w-full bottom-0 left-0 opacity-0"
                >
                    <div className="tu-content p-3 rounded-md">
                        <div className="flex w-full items-center justify-between">
                            <span className="fw-7"></span>
                            <button
                                onClick={toggleFullScreen}
                                className="bg-neutral-800 bg-opacity-90 px-3 py-1 rounded-md text-white"
                            >
                                <i className="fi fi-br-expand"></i>
                            </button>
                        </div>
                        <div
                            className="flex-1 w-full"
                            onClick={togglePlay}
                        ></div>
                        {!state.fullScreen ? null : (
                            <PlayerControls
                                className="relative"
                                state={state}
                                player={playerRef.current}
                                togglePlay={togglePlay}
                                onVolumeWheel={_onVolumeWheel}
                                toggleMute={_toggleMute}
                                setState={setState}
                            />
                        )}
                    </div>
                </div>
            </div>
            {state.fullScreen ? null : (
                <PlayerControls
                    className="relative"
                    state={state}
                    player={playerRef.current}
                    togglePlay={togglePlay}
                    onVolumeWheel={_onVolumeWheel}
                    toggleMute={_toggleMute}
                    setState={setState}
                />
            )}
        </div>
    );
};

export default TuPlayer;

function PlayerControls({
    player,
    state,
    togglePlay,
    onVolumeWheel,
    className = "",
    toggleMute, setState
}: {
    className?: string;
    player: HTMLVideoElement;
    state: typeof initPlayerState;
    togglePlay: (ev: any) => any;
    onVolumeWheel: (ev: any) => any;
    toggleMute: (ev: any) => any;
    setState: ReturnType<typeof useState<typeof initPlayerState>>[1]
}) {
    return (
        <div
            className={
                "w-full p-3 rounded-md bg-neutral-800 bg-opacity-90 flex flex-col "
            }
        >
            <div
                id="player-controls"
                className="flex gap-3 items-center justify-between w-full"
            >
                <div className=""></div>
                <div className="flex gap-1">
                    <button className="tu-menu-item-min">
                        <i className="fi fi-br-shuffle"></i>
                    </button>
                    <button className="tu-menu-item-min">
                        <i className="fi fi-br-angle-double-small-left"></i>
                    </button>
                    <button className="tu-menu-item-min">
                        <i className="fi fi-br-angle-small-left"></i>
                    </button>
                        <button
                        onClick={togglePlay}
                        className="tu-menu-item-min text-xl"
                    >
                        <i
                            className={`fi fi-br-${!state.isReady ? "loading": state.isPlaying ? "pause" : "play"} `}
                        ></i>
                        {/* <TuIcon pkg="fi" name="br-play"/> */}
                    </button>
                    <button className="tu-menu-item-min">
                        <i className="fi fi-br-angle-small-right"></i>
                    </button>
                    <button className="tu-menu-item-min">
                        <i className="fi fi-br-angle-double-small-right"></i>
                    </button>
                    <button onClick={()=>{setState(s=> ({...s, repeat: !s.repeat}))}} className="tu-menu-item-min">
                        <i className={`fi fi-br-arrows-repeat${state.repeat ? '-1' : ''}`}></i>
                    </button>
                </div>
                <div className="">
                    <button
                    onClick={toggleMute}
                        className="flex items-center flex-col"
                        onWheel={onVolumeWheel}
                    >
                        <span className="fs-12 fw-6 font-mono">
                            {Math.floor(state.volume * 100)}%
                        </span>
                        <span>
                            <i
                                className={`fi fi-br-volume${state.muted ? "-slash" : state.volume < 50 / 100 && state.volume > 0 ? "-down" : state.volume <= 0 ? "-off" : ""}`}
                            ></i>
                        </span>
                    </button>
                </div>
            </div>
            <div className="flex w-full gap-2 items-center">
                <span className="fs-12">
                    {formatDuration(state.currentTime)}
                </span>
                <div className="flex-1">
                    <TuSlider
                        onChange={(e) => {
                            player.currentTime = Number(
                                (e.target as any).value
                            );
                        }}
                        value={state.currentTime}
                        max={state.duration}
                        className="w-full"
                    />
                </div>
                <span className="fs-12">{formatDuration(state.duration)}</span>
            </div>
        </div>
    );
}
