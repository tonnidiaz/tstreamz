import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {init} from '@neutralinojs/lib'
import "@repo/ui/styles/tw.css";
import "@repo/ui/styles/all.scss";
const mountApp = () => {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
};

async function main() {
        mountApp();
        init()
}
main();
