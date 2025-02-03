"use client";
import { updateAppStore } from "@/redux/reducers/app";
import { RootState } from "@/redux/store";
import { CONFIG } from "@/utils/consts";
import Navbar from "@repo/ui-next/components/Navbar";
import TMeta from "@repo/ui-next/components/TMeta";
import TuLink from "@repo/ui-next/components/TuLink";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const Layout = ({ children }: { children: React.ReactNode }) => {
    const appStore = useSelector((s: RootState) => s.app);
    const dispatch = useDispatch()
    async function init() {
        dispatch(updateAppStore({path: 'ready', value: true}))
    }

    const onResize = async() =>{
        // return
        const sz = {w: innerWidth, h: innerHeight}
        dispatch(updateAppStore({path: 'screenSz', value: sz}))
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
        <TMeta title={`${appStore.title}`}/>
            <Navbar
                site={appStore.title}
                ready={appStore.ready}
                menuItems={
                    <>
                        <li className="tu-menu-item"><TuLink noactive to='/jobs'>Jobs</TuLink></li>
                        <li className="tu-menu-item"><TuLink noactive to='/contact'>Contact</TuLink></li>
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
