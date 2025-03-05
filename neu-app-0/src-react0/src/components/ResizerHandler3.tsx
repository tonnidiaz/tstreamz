import { useEffect } from "react";
import {window as appWin} from '@neutralinojs/lib'
const ResizeHandler3 = () => {
    useEffect(() => {
        init();
    }, []);

    const init = () => {
        console.log("RESIZER 3");
        const windowElement = document.getElementById("window");
        const resizeHandles = document.querySelectorAll(".resize-handle");

        let isResizing = false;
        let currentHandle = null;
        let initialX,
            initialY,
            initialWidth,
            initialHeight,
            initialTop,
            initialLeft;

        async function startResize(e) {
            isResizing = true;
            currentHandle = e.target;
            initialX = e.clientX;
            initialY = e.clientY;

            const winSz = await appWin.getSize()
            const winPos = await appWin.getPosition()
            initialWidth = winSz.width//windowElement.offsetWidth;
            initialHeight = winSz.height//windowElement.offsetHeight;
            initialTop = winPos.y// windowElement.offsetTop;
            initialLeft = winPos.x// windowElement.offsetLeft;

            document.addEventListener("mousemove", resize);
            document.addEventListener("mouseup", stopResize);
        }

        async function resize(e) {
            if (!isResizing) return;

            const deltaX = e.clientX - initialX;
            const deltaY = e.clientY - initialY;
            console.log({currentHandle: currentHandle.id});
            switch (currentHandle.id) {
                case "bottom-right-resize":
                    // windowElement.style.width = initialWidth + deltaX + "px";
                    // windowElement.style.height = initialHeight + deltaY + "px";
                    await appWin.setSize({width:  initialWidth + deltaX, height: initialHeight + deltaY})
                    break;
                case "bottom-left-resize":
                    // windowElement.style.width = initialWidth - deltaX + "px";
                    // windowElement.style.height = initialHeight + deltaY + "px";
                    // windowElement.style.left = initialLeft + deltaX + "px";
                    appWin.setSize({width:  initialWidth - deltaX, height: initialHeight + deltaY}).then(()=>{appWin.move(initialLeft + deltaX, initialTop)})
                    // 
                    break;
                case "top-right-resize":
                    // windowElement.style.width = initialWidth + deltaX + "px";
                    // windowElement.style.height = initialHeight - deltaY + "px";
                    // windowElement.style.top = initialTop + deltaY + "px";
                    await appWin.setSize({width:  initialWidth + deltaX, height: initialHeight - deltaY})
                    await appWin.move(initialLeft, initialTop +deltaY)
                    break;

                case "top-left-resize":
                    // windowElement.style.width = initialWidth - deltaX + "px";
                    // windowElement.style.height = initialHeight - deltaY + "px";
                    // windowElement.style.top = initialTop + deltaY + "px";
                    // windowElement.style.left = initialLeft + deltaX + "px";
                    await appWin.setSize({width:  initialWidth - deltaX, height: initialHeight - deltaY})
                    await appWin.move(initialLeft + deltaX, initialTop + deltaY)
                    break;
                default:
                    break;
            }
        }

        function stopResize() {
            isResizing = false;
            currentHandle = null;
            document.removeEventListener("mousemove", resize);
            document.removeEventListener("mouseup", stopResize);
        }

        resizeHandles.forEach((handle) => {
            handle.addEventListener("mousedown", startResize);
        });
    };
    return <></>;
};

export default ResizeHandler3;
