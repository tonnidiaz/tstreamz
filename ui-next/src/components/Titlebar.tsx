import { ReactNode, useEffect, useState } from "react";

const Titlebar = ({
    leading,
    title,
    trailing,
    isMaximized,
    minimize,
    toggleMaximize,
    close,

}: {
    title?: ReactNode;
    trailing?: ReactNode;
    leading?: ReactNode;
    close?: () => any;
    minimize?: () => any;
    toggleMaximize?: () => any;
    isMaximized?: () => Promise<boolean>;
    
}) => {
    const [_isMax, setIsMax] = useState<boolean>(false);
    useEffect(() => {

        try{isMaximized().then(async (v) => {
            setIsMax(v);
        }).catch(err=>{});}
        catch(err){}
        
    }, []);
    return (
        <div
            style={{ widows: 1, zIndex: 25 }}
            data-tauri-drag-region
            className="titlebar gap-5 flex items-center justify-between text-neutral-300"
        >
            <div className="actions pl-3">{leading}</div>
            <div className="center flex-1 overflow-hidden wp-nowrap ellipsis">
                <h1 className="text-center fs-14">
                    {title}
                </h1>
            </div>
            <div className="flex gap-2 items-center">
                <div className="mr-2">
                    {trailing}
                </div>
                <div
                    onClick={() => {
                        minimize();
                    }}
                    className="titlebar-button"
                    id="titlebar-minimize"
                >
                    <span>
                        <i className="fi fi-br-window-minimize"></i>
                    </span>
                </div>
                <div
                    onClick={() => {
                        // appWindow.toggleMaximize();

                        toggleMaximize();
                        setIsMax(!_isMax);
                    }}
                    className="titlebar-button"
                    id="titlebar-maximize"
                >
                    <span>
                        <i
                            className={`fi fi-${_isMax ? "rr" : "sr"}-window-maximize`}
                        ></i>
                    </span>
                </div>
                <div
                    onClick={() => {
                        close();
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
