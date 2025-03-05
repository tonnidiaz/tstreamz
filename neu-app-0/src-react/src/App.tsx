import { useEffect, useRef, useState } from "react";
import "@repo/ui/styles/all.scss";
import "@/styles/main.scss";
import "@flaticon/flaticon-uicons/css/all/all.css";
import Titlebar from "./components/Titlebar";
import { handleErrs, timedLog } from "@cmn/utils/funcs";
import UButton from "@repo/ui-next/components/UButton";
import { useTuState } from "@repo/ui-next/lib/hooks";
import { getBaseDir, getFilename, tuImmer } from "@cmn/utils/funcs4";
import { videoExtensions } from "@cmn/utils/consts";
import { Child, Command } from "@tauri-apps/api/shell";
import ResizerHandler from "./components/ResizerHandler";
import ResizerHandler3 from "./components/ResizerHandler3";
import UInput from "@repo/ui-next/components/UInput";

function App() {
    const reactMounted = useRef(false)

    const [, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const [neuOn, setNeuOn] = useState(false)
    const [LibGoState, setLibGoState] = useState({
        on: false,
        pid: 0,
        port: 0,
    });

    const ws = useTuState<WebSocket | null>(null);
    const state = useTuState<{ currentFile?: string }>({});
    const playerRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        return
       if (!reactMounted.current){
        reactMounted.current = true
        setNeuOn(true)
        // initGoLib().then(() => {});
        // return () => {
        //     if (LibGoState.pid) new Child(LibGoState.pid).kill();
        // };
       console.log({NL_TOKEN: window.NL_TOKEN});
       }
        
    }, []);
  
    useEffect(() => {
        if (LibGoState.on) {
            console.log({ LibGo_ON: LibGoState.on });
            initWs();
        }
    }, [LibGoState.on]);

   
   
    async function initWs() {
        if (ws.value) return;
        timedLog("INit ws");
        try {
            const _ws = new WebSocket("ws://localhost:45874/ws");
            _ws.onopen = () => {
                timedLog(`ws:open`);
            };
            _ws.onerror = (err) => {
                timedLog("ws-err:");
                handleErrs(err);
            };
            _ws.onmessage = (ev) => {
                timedLog(`[ws:msg]`, ev.data);
                console.log(JSON.parse(ev.data));
            };
            _ws.close = (code, reason) => {
                timedLog(`[ws:close]`, { code, reason });
            };

            ws.value = _ws;
        } catch (err) {
            handleErrs(err);
        }
    }


  

    return (!neuOn && false ? null :
        <>
        <div className="flex-col gap-2 p-4 m-auto w-500px">
            <UButton className="btn-primary">Button</UButton>
            <button className="btn btn-primary">This button</button>
            <UInput placeholder="Uinput..."/>
        </div>
        {/* <ResizerHandler3/> */}
            {/* <div className="flex-col h-full w-full">
                <Titlebar />
                <div className="tu-app">
                    {LibGoState.on && neuOn ? (
                        <div className="p-4 flex-col gap-4 h-full oy-scroll">
                            <div>
                                {state.value.currentFile && (
                                    <h1 className="text-center fs-16 fw-6 max-lines-2 ellipsis">
                                        {getFilename(state.value.currentFile)}
                                    </h1>
                                )}
                            </div>

                            <div
                                id="video-cont"
                                className="bg-card rounded-md w-full h-500px"
                            >
                                <video
                                    ref={playerRef}
                                    disablePictureInPicture
                                    controls
                                >
                                    {state.value.currentFile && (
                                        <source
                                            src={`http://localhost:${LibGoState.port}/files?path=${encodeURIComponent(state.value.currentFile)}`}
                                        />
                                    )}
                                </video>
                            </div>
                            <UButton
                                className="btn-primary"
                            >
                                Pick video
                            </UButton>
                            <section>
                                <h3 className="ttl">Playlist</h3>
                                <div className="mt-3 p-2 flex ox-scroll gap-3">
                                    {Array(10)
                                        .fill(2)
                                        .map((el, i) => (
                                            <div key={`vid-${i}`}>
                                                <div className="vid-card">
                                                    <img
                                                        src="/images/img.jpg"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="p-2">
                                                    <h4 className="fs-14 max-lines-2 ellipsis">
                                                        Lorem ipsum dolor sit
                                                        amet consectetur
                                                        adipisicing elit.
                                                        Voluptatem dolorum minus
                                                        aliquam praesentium
                                                        voluptate tempora. Nisi
                                                        saepe porro dolores
                                                        dolore inventore ipsum
                                                        nobis molestias nostrum
                                                        architecto pariatur.
                                                        Asperiores, aspernatur
                                                        provident!
                                                    </h4>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="loading-div">
                            <span className="loading loading-lg loading-ring"></span>
                        </div>
                    )}
                </div>
            </div> */}
        </>
    );
}

export default App;
