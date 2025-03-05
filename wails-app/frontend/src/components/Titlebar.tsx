// import { dialog, window as win } from "@tauri-apps/api";
// import { appWindow } from "@tauri-apps/api/window";

import { WindowMinimise, WindowToggleMaximise } from "wailsjs/runtime/runtime";
import { CloseApp } from "wailsjs/go/main/App";
import {  } from "wailsjs/runtime/runtime";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Titlebar = () => {
    const appStore = useSelector((s: RootState) => s.app);
    return (
        <div
            style={{ widows: 1 }}
            data-tauri-drag-region
            className="titlebar flex items-center justify-between"
        >
            <div className="actions"></div>
            <div className="center flex-1"><h1 className="text-center fs-14">{appStore.title}</h1></div>
            <div className="flex gap-2 items-center">
                <div
                    onClick={() => {
                        // appWindow.minimize();
                        WindowMinimise();
                    }}
                    className="titlebar-button"
                    id="titlebar-minimize"
                >
                    <span>
                        {" "}
                        <i className="fi fi-br-window-minimize"></i>
                    </span>
                </div>
                <div
                    onClick={() => {
                        // appWindow.toggleMaximize();
                        WindowToggleMaximise();
                    }}
                    className="titlebar-button"
                    id="titlebar-maximize"
                >
                    <span>
                        <i className="fi fi-br-window-maximize"></i>
                    </span>
                </div>
                <div
                    onClick={() => {
                        // Prompt("Are you sure you want to close app?")

                        //     .then((r) => {
                        //         if (r) Window;
                        //     });
                        CloseApp();
                    }}
                    className="titlebar-button"
                    id="titlebar-close"
                >
                    <span>
                        <i className="fi fi-br-cross"></i>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Titlebar;
