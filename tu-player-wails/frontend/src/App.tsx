import "preline/preline";
import "@mobile/ui-next/styles/main.scss";
import "@/styles/main.scss";
import { IStaticMethods } from "preline/preline";
import { useEffect, useRef } from "react";

import { handleErrs, timedLog } from "@cmn/utils/funcs";
import { BrowserRouter, Routes, Route, Link } from "react-router";
import { getFilename, tuImmer } from "@cmn/utils/funcs4";
import {
    WindowIsMaximised,
    WindowMinimise,
    WindowToggleMaximise,
} from "wailsjs/runtime/runtime";
import { useDispatch, useSelector } from "react-redux";
import Titlebar from "@mobile/ui-next/components/Titlebar";
import HomePage from "./pages";
import { updateAppState } from "./redux/reducers/app";
import { RootState } from "./redux/store";
import TuDropdown from "@mobile/ui-next/components/TuDropdown";
import RFPage from "./pages/rf";
import TuMiniSidebar from "@mobile/ui-next/components/TuMiniSidebar";
import TuSidebarItem from "@mobile/ui-next/components/TuSidebarItem";
import TuDivider from "@mobile/ui-next/components/TuDivider";
import { setPlayerState } from "./redux/reducers/player";
import { CloseApp, GetArgs, GetPort, ImportVideo } from "@wailsjs/go/main/App";
import { useTuState } from "@repo/ui-next/lib/hooks";
import TuErrorBoundary from "@repo/ui-next/components/ErrorBoundary";
declare global {
    interface Window {
        HSStaticMethods: IStaticMethods;
        cv: any;
    }
}
function App() {
    const pageRef = useRef<HTMLDivElement>(null);
    const appState = useSelector((s: RootState) => s.app);
    const playerState = useSelector((s: RootState) => s.player);
    const ready = useTuState(false)
    const dispatch = useDispatch();

    async function importVideo() {
        ImportVideo()
            .then((file) => {
                if (!file) return;
                dispatch(setPlayerState({ path: "currentFile", value: file }));
            })
            .catch(handleErrs);
    }
    const setPort = (p: number = 45874) => {
        dispatch(updateAppState({ path: "port", value: p }));
    };

    async function getAppArgs() {
        try {
            timedLog("Getting app args...")
            const args = await GetArgs();
            console.log({args});
            dispatch(updateAppState({path: "args", value: args || []}))
        } catch (err) {}
        finally{
            ready.value = true
        }
    }
    useEffect(() => {
        try {
            window.HSStaticMethods.autoInit();
            getAppArgs()
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
        }
    }, []);

    return (
        <BrowserRouter>
            <div ref={pageRef} className="flex flex-col h-full w-full">
                <Titlebar
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
                            <TuDropdown
                                trigger={<button>Edit</button>}
                            ></TuDropdown>
                        </div>
                    }
                    title={appState.title}
                    close={CloseApp}
                    minimize={WindowMinimise}
                    toggleMaximize={WindowToggleMaximise}
                    isMaximized={WindowIsMaximised}
                />
                <div
                    className="tu-app flex-1 flex w-full items-start"
                    id="tu-app"
                >
                    <TuErrorBoundary>
                    <>
                    <TuMiniSidebar>
                        <TuSidebarItem
                            to="/"
                            icon={<i className="fi fi-rr-home"></i>}
                            label="Home"
                        />
                        <TuSidebarItem
                            to="/rf"
                            icon={<i className="fi fi-rr-man-scientist"></i>}
                            label="RF"
                        />
                    </TuMiniSidebar>
                    {ready.value ? <div className="flex-1 max-h-full relative overflow-y-scroll">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/rf" element={<RFPage />} />
                        </Routes>
                    </div> : <div className="loading-div"></div>}
                    </>
                    </TuErrorBoundary>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
