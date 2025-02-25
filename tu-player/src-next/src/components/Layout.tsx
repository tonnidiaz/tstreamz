"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { init, window as neuWin } from "@neutralinojs/lib";
import Script from "next/script";

let _host = "";
const TuLayout = ({
    children,
    host,
}: {
    children: ReactNode;
    host?: string;
}) => {
    function init() {
        let isDragging = false;
        let offsetX, offsetY;
        const dragbar: HTMLDivElement = document.querySelector("#dragbar");
        dragbar?.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX;
            offsetY = e.clientY;
        });

        dragbar?.addEventListener("mousemove", async (e) => {
            
            if (isDragging) {
                let pos = await neuWin.getPosition();
                let newX = pos.x + (e.clientX - offsetX);
                let newY = pos.y + (e.clientY - offsetY);
                neuWin.move(newX, newY);
            }
        });

        dragbar?.addEventListener("mouseup", () => {
            isDragging = false;
        });
    }

    function resizer() {
        let isResizing = false;
        let resizeDirection = null;
        let startX, startY, startWidth, startHeight;

        window.addEventListener("mousedown", async (e) => {
            let pos = await neuWin.getPosition();
            let size = await neuWin.getSize();

            let rightEdge = pos.x + size.width - 10;
            let bottomEdge = pos.y + size.height - 10;
            if (e.clientX >= rightEdge && e.clientY >= bottomEdge) {
                isResizing = true;
                resizeDirection = "both";
            } else if (e.clientX >= rightEdge) {
                isResizing = true;
                resizeDirection = "horizontal";
            } else if (e.clientY >= bottomEdge) {
                isResizing = true;
                resizeDirection = "vertical";
            }
            console.log(e.clientX, e.clientY,  {pos, rightEdge, bottomEdge});
            console.log({isResizing, resizeDirection});
            if (isResizing) {
                startX = e.clientX;
                startY = e.clientY;
                startWidth = size.width;
                startHeight = size.height;
            }
        });

        window.addEventListener("mousemove", async (e) => {
            if (!isResizing) return;

            let newWidth = startWidth + (e.clientX - startX);
            let newHeight = startHeight + (e.clientY - startY);

            if (
                resizeDirection === "horizontal" ||
                resizeDirection === "both"
            ) {
                newWidth = Math.max(300, newWidth);
            }

            if (resizeDirection === "vertical" || resizeDirection === "both") {
                newHeight = Math.max(200, newHeight);
            }

            await neuWin.setSize({
                width: newWidth,
                height: newHeight,
            });
        });

        window.addEventListener("mouseup", () => {
            isResizing = false;
            resizeDirection = null;
        });
    }
    useEffect(() => {
        console.log(window.location);
        (async () => {
            console.log({ title: await neuWin.getTitle() });
        })();

        init();
        resizer();
    }, []);
    return (
        <html lang="en" className="dark" data-theme="dark">
            <head>
                <Script src="/main.js" />
                <Script src="/neutralino.js" async />
                {/* <style>{`:root{color-scheme: light}`}</style> */}
            </head>
            <body>
                <div className="h-70px w-full bg-base-200" id="dragbar"></div>
                <Layout>{children}</Layout>
            </body>
        </html>
    );
};

export default TuLayout;

const Layout = ({ children }: { children: ReactNode }) => {
    const [neuVarsLoaded, setNeuVarsLoaded] = useState(false);
    useEffect(() => {
        const inter = setInterval(() => {
            if (window.NL_PORT) {
                setNeuVarsLoaded(true);
                clearInterval(inter);
            }
        }, 500);
    }, []);

    useEffect(() => {
        if (neuVarsLoaded) {
            _init();
        }
    }, [neuVarsLoaded]);

    const _init = async () => {
        try {
            try {
                // init()
                init();
                console.log("\nNEUTRALINO INITIALIZED");
            } catch (e) {
                console.log(e);
            }
        } catch (err) {
            console.log(err);
        }
    };
    return <>{children}</>;
};
