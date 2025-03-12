import "@flaticon/flaticon-uicons/css/all/all.css";
import "preline/preline";
import "@mobile/ui-next/styles/main.scss";
import "@/styles/main.scss";

import { useEffect, useRef } from "react";

import { handleErrs, timedLog } from "@cmn/utils/funcs";
import { BrowserRouter, Routes, Route } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import HomePage from "./pages";
import { updateAppState } from "./redux/reducers/app";
import { RootState } from "./redux/store";
import RFPage from "./pages/rf";
import { setPlayerState } from "./redux/reducers/player";
import { GetArgs, GetPort, ImportVideo } from "@wailsjs/go/main/App";
import { useTuState } from "@repo/ui-next/lib/hooks";
import TuDivider from "@repo/ui-next-preline/components/TuDivider";
import TuDropdown from "@repo/ui-next-preline/components/TuDropdown";
import TuMiniSidebar from "@repo/ui-next-preline/components/TuMiniSidebar";
import TuSidebarItem from "@repo/ui-next-preline/components/TuSidebarItem";
import TuTeleport from "@repo/ui-next/components/TuTeleport";
import { showToast } from "@repo/ui-next-preline/lib/funcs";

function App() {
    const pageRef = useRef<HTMLDivElement>(null);
    const appState = useSelector((s: RootState) => s.app);
    const playerState = useSelector((s: RootState) => s.player);
    const ready = useTuState(false);
    const dispatch = useDispatch();

    async function importVideo() {
        ImportVideo()
            .then((file) => {
                if (!file) return;
                dispatch(setPlayerState(["currentFile", file + "#"]));
            })
            .catch(handleErrs);
    }
    const setPort = (p: number = 45874) => {
        dispatch(updateAppState({ path: "port", value: p }));
    };

    async function getAppArgs() {
        try {
            timedLog("Getting app args...");
            const args = await GetArgs();
            console.log({ args });
            dispatch(updateAppState({ path: "args", value: args || [] }));
        } catch (err) {
        } finally {
            ready.value = true;
        }
    }
    useEffect(() => {
        try {
            window.HSStaticMethods.autoInit();
            getAppArgs();
        } catch (err) {
            handleErrs(err);
        }
    }, []);

    useEffect(() => {
        try {
            GetPort()
                .then((r) => {
                    setPort(r);
                })
                .catch((err) => {
                    setPort();
                });
        } catch (err) {
            // handleErrs(err);
            setPort();
            showToast;
        }
    }, []);

    return (
        <BrowserRouter>
            <TuTeleport to="#titlebar-slot">
                <div className="flex gap-4 items-center">
                    <TuDropdown trigger={<button>File</button>}>
                        <button onClick={importVideo} className="tu-menu-item">
                            Import video
                        </button>
                        <TuDivider />
                        <button className="tu-menu-item">Exit</button>
                    </TuDropdown>
                    <TuDropdown trigger={<button>Edit</button>}></TuDropdown>
                </div>
                <h1 className="_title flex-1">{appState.title}</h1>
            </TuTeleport>
            <div ref={pageRef} className="flex flex-col h-full w-full">
                {/* <Titlebar
            leading={
                <div className="flex gap-4 items-center">
                    <TuDropdown trigger={<button>File</button>}>
                        <button
                            onClick={importVideo}
                            className="tu-menu-item"
                        >
                            Import video
                        </button>
                        <TuDivider />
                        <button className="tu-menu-item">Exit</button>
                    </TuDropdown>
                    <TuDropdown trigger={<button>Edit</button>}></TuDropdown>
                </div>
            }
            title={appState.title}
            close={CloseApp}
            minimize={WindowMinimise}
            toggleMaximize={WindowToggleMaximise}
            isMaximized={WindowIsMaximised}
        /> */}
                <div
                    className="tu-app flex-1 flex w-full items-start"
                    id="tu-app"
                >
                    {/* <TuErrorBoundary> */}
                    <>
                        <TuMiniSidebar>
                            <TuSidebarItem
                                to="/"
                                icon={<i className="fi fi-rr-home"></i>}
                                label="Home"
                            />
                            <TuSidebarItem
                                to="/rf"
                                icon={
                                    <i className="fi fi-rr-man-scientist"></i>
                                }
                                label="RF"
                            />
                        </TuMiniSidebar>
                        {ready.value ? (
                            <div className="flex-1 max-h-full h-full relative overflow-hidden">
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/rf" element={<RFPage />} />
                                </Routes>
                            </div>
                        ) : (
                            <div className="loading-div"></div>
                        )}
                    </>
                    {/* </TuErrorBoundary> */}
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
