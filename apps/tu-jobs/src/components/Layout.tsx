"use client";
import { store } from "@/store";
import { CONFIG } from "@/utils/consts";
import Navbar from "@repo/ui-next/components/Navbar";
import TMeta from "@repo/ui-next/components/TMeta";
import TuLink from "@repo/ui-next/components/TuLink";
import { useTuStore } from "@repo/ui-next/store/utils";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const appStore = useTuStore(store.app());

    async function init() {
        appStore.value.ready = true;
    }

    const onResize = async() =>{
        // return
        const sz = {w: innerWidth, h: innerHeight}
        appStore.value = {...appStore.value, screenSz: sz}
        // appStore.value.counter += 1
    }
    useEffect(() => {
        console.log("[Tu-app] mounted");
        onResize();
        window.onresize = onResize
        CONFIG.host = location.host
        init();
        
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return (
        <>
        <TMeta title={`${appStore.value.title}`}/>
            <Navbar
                site={appStore.value.title}
                ready={appStore.value.ready}
                menuItems={
                    <>
                        <li className="tu-menu-item"><TuLink noactive to='/jobs'>Jobs</TuLink></li>
                    </>
                }
                hasLogin={false}
            ></Navbar>
            <div className="tu-app oy-scroll">{children}</div>

            <div id="ctx-overlay"></div>
            <div id="tu-toasts" className="toast toast-top toast-end"></div>
        </>
    );
};

export default Layout;
