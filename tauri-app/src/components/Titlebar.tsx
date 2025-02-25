import { dialog, window as win } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";

const Titlebar = () => {
    return (
        <div data-tauri-drag-region className="titlebar flex items-center">
            <div
                onClick={() => {
                    appWindow.minimize();
                }}
                className="titlebar-button"
                id="titlebar-minimize"
            >
                <span> <i className="fi fi-br-window-minimize"></i></span>
               
            </div>
            <div
                onClick={() => {
                    appWindow.toggleMaximize();
                }}
                className="titlebar-button"
                id="titlebar-maximize"
            >
                <span><i className="fi fi-br-window-maximize"></i></span>
                
            </div>
            <div
                onClick={() => {
                    dialog
                        .ask("Are you sure you want to close app?")
                        .then((r) => {
                            if (r) appWindow.close();
                        });
                }}
                className="titlebar-button"
                id="titlebar-close"
            >
                <span><i className="fi fi-br-cross"></i></span>
            </div>
        </div>
    );
};

export default Titlebar;
