import { useEffect } from "react";
import $ from "jquery";
import neu from '@neutralinojs/lib'
const ResizerHandler = () => {
    useEffect(() => {
        initResizers();
    }, []);

    async function initResizers() {
        console.log(`RESIZE HANDLER\n`);
        neu.window.setSize({resizable: true})
        const sz = await neu.window.getSize()
        console.log({sz});
        const INIT_POS = { x: 0, y: 0 };
        let isResizing = false;
        let initPos = INIT_POS;
        let delt = INIT_POS;
        let initSz = {w: 0, h: 0}
        $("#resizers .resizer").on("mousedown", async(e) => {
            isResizing = true;
            initPos = { x: e.clientX, y: e.clientY };
            const winSz = await neu.window.getSize()
            initSz = {w: winSz.width, h: winSz.height}
            console.log({ initPos, initSz });
        });
        $("html").on("mouseup", (e) => {
            isResizing = false;
            initPos = INIT_POS;
            delt = INIT_POS;
        });
        $("#resizers .resizer").on("mousemove", async (e) => {
            if (isResizing) {
                // console.log({ isResizing });
                const winSz = await neu.window.getSize()
                console.log({winSz});
                delt = { x: (e.clientX - initPos.x), y: -(e.clientY - initPos.y) };
                
            }
        });

        $("#resizers .bottom .mid").on("mousemove", (e) => {
            if (isResizing) {
                console.log({ delt });
                neu.window.setSize({
                    resizable: true,
                    height: initSz.h - delt.y
                })
            }
        });
    }
    return <></>;
};

export default ResizerHandler;
