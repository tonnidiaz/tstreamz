import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { dialog, fs, path } from "@tauri-apps/api";
import "@repo/ui/styles/all.scss";
import "@/styles/main.scss";
import "@flaticon/flaticon-uicons/css/all/all.css"
import Titlebar from "./components/Titlebar";
import { handleErrs, timedLog } from "@cmn/utils/funcs";
import UButton from "@repo/ui-next/components/UButton";
import { useTuState } from "@repo/ui-next/lib/hooks";
import { getBaseDir, getFilename, tuImmer } from "@cmn/utils/funcs4";
import { videoExtensions } from "@cmn/utils/consts";
import { Command } from "@tauri-apps/api/shell";

const src =
    "http://localhost:45875/files?path=%2FUSB%2FPurple_Hearts_(2022)_(NetNaija.com)_(1).mp4";
function App() {
    const [, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const ws = useTuState<WebSocket | null>(null)
    const state = useTuState<{ currentFile?: string }>({});

    useEffect(()=>{
        initGoLib().then(()=>{
           initWs() 
        })
        
    },[])
    useEffect(()=>{
            const {currentFile} = state.value
            if (currentFile){
                // Read other files in directory
                const dir = getBaseDir(currentFile)
                fs.readDir(dir, {recursive: false}).then(r=>{
                    const videoFiles = r.filter(el=> videoExtensions.includes(el.name?.split('.').pop() as string)).map(el=>el.path)
                    if (videoFiles.length){
                        ws.value?.send(JSON.stringify({ev: 'GetFileSz', data: videoFiles}))
                    }
                }).catch(handleErrs)
            }
    }, [state.value.currentFile])

    async function initGoLib(){
        // Initialize the Go backend
        try {
            const cmd = Command.sidecar("./binaries/prod/lib-go")
            const r = await cmd.execute()
            console.log(r);
        } catch (err){handleErrs(err)}
    }
    async function initWs(){
        if (ws.value) return;
        try {
            const _ws = new WebSocket("ws://localhost:45874/ws")
            _ws.onopen = ()=>{
                timedLog(`ws:open`);
            }
            _ws.onerror = (err) =>{
                timedLog('ws-err:');
                handleErrs(err)
            }
            _ws.onmessage = (ev)=>{
                timedLog(`[ws:msg]`, ev.data);
                console.log(JSON.parse(ev.data));
            }
            _ws.close = (code, reason)=>{
                timedLog(`[ws:close]`, {code, reason});
            }
            
            ws.value = _ws
        } catch (err) {
            handleErrs(err)
        }
    }
    async function greet() {
        // Learn more about Tauri commands at https://v1.tauri.app/v1/guides/features/command
        setGreetMsg(await invoke("greet", { name }));
    }

    async function pickVideo() {
        try {
            fs;
            const res = await dialog.open({
                title: "Open video file",
                filters: [
                    { extensions: ["mp4", "mkv", "avi", "ts"], name: "videos" },
                ],
            });
            if (res) {
                state.value = tuImmer(
                    state.value,
                    (s) => (s.currentFile = res as string)
                );
            }


        } catch (err) {
            handleErrs(err);
        }
    }

    return (
        <>
            <div className="flex-col h-full w-full">
                <Titlebar />
                <div className="tu-app">
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
                            className="bg-card rounded-md w-full h-200px"
                        >
                            <video disablePictureInPicture controls>
                                <source src={src} />
                            </video>
                        </div>
                        <UButton onClick={pickVideo} className="btn-primary">
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
                                                    Lorem ipsum dolor sit amet
                                                    consectetur adipisicing
                                                    elit. Voluptatem dolorum
                                                    minus aliquam praesentium
                                                    voluptate tempora. Nisi
                                                    saepe porro dolores dolore
                                                    inventore ipsum nobis
                                                    molestias nostrum architecto
                                                    pariatur. Asperiores,
                                                    aspernatur provident!
                                                </h4>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
