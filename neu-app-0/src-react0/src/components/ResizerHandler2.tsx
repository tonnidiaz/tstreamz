import { useEffect } from "react";
import Neutralino from "@neutralinojs/lib"
const ResizerHandler2 = () => {

    useEffect(()=>{
        init()
    }, [])
    const init = () =>{
        let isResizing = false;
        let direction = "";
        let startX, startY, startWidth, startHeight, startPosX, startPosY;
        
        function startResize(e, dir) {
            isResizing = true;
            direction = dir;
            startX = e.clientX;
            startY = e.clientY;
        
            // Get current window size and position once
            Promise.all([Neutralino.window.getSize(), Neutralino.window.getPosition()])
                .then(([size, pos]) => {
                    startWidth = size.width;
                    startHeight = size.height;
                    startPosX = pos.x;
                    startPosY = pos.y;
                });
        
            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", stopResize);
        }
        
        function resize(e) {
            if (!isResizing) return;
        
            let diffX = e.clientX - startX;
            let diffY = e.clientY - startY;
            let newWidth = startWidth;
            let newHeight = startHeight;
            let newX = startPosX;
            let newY = startPosY;
        
            if (direction.includes("right")) newWidth = startWidth + diffX;
            if (direction.includes("bottom")) newHeight = startHeight + diffY;
        
            if (direction.includes("left")) {
                newWidth = startWidth - diffX;
                newX = startPosX + diffX;
            }
        
            if (direction.includes("top")) {
                newHeight = startHeight - diffY;
                newY = startPosY + diffY;
            }
        
            // Prevent window from getting too small
            newWidth = Math.max(300, newWidth);
            newHeight = Math.max(200, newHeight);
        
            // Apply updates smoothly
            requestAnimationFrame(() => {
                if (direction.includes("left") || direction.includes("top")) {
                    Neutralino.window.move(newX, newY);
                }
                Neutralino.window.setSize({ width: newWidth, height: newHeight });
            });
        }
        
        function stopResize() {
            isResizing = false;
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResize);
        }
        
        // Attach resize event listeners to div handles
        // document.addEventListener("DOMContentLoaded", () => {
            console.log("DOMContentLoaded");
            document.querySelectorAll(".resize-handle").forEach(handle => {
                handle.addEventListener("mousedown", (e) => {
                    startResize(e, handle.dataset.direction);
                });
            // });
        });
        
        
        
    }
    return ( <></> );
}
 
export default ResizerHandler2;