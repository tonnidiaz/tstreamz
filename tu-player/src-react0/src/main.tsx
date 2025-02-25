import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { init, server } from "@neutralinojs/lib";
import { videoFolder } from "./lib/consts.ts";

const main = async () => {
    try {
        createRoot(document.getElementById("root")!).render(
            <StrictMode>
                <App />
            </StrictMode>
        );
        init();

        const mounts = Object.values((await server.getMounts()) as any);
        if (!mounts.includes("./videos")) {
            const r = await server.mount(videoFolder, NL_PATH + "/videos");
        }
    } catch (err) {
        console.log(err);
    } finally {
    }
};

main();
