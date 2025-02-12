"use client";
import Navbar from "@repo/ui-next/components/Navbar";
import
UButton from "@repo/ui-next/components/UButton";
import { useTuStore0, useTuStore } from "@repo/ui-next/store/utils";
import { useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux'
import { RootState } from "@/redux/store";
import { incrVersion } from "@/redux/reducers/app";
import TuLink from "@repo/ui-next/components/TuLink";
const Layout = ({ children }: { children: React.ReactNode }) => {

    const rStore = useSelector((state: RootState)=> state.app)
    const dispatch = useDispatch()

    async function init() {
        // await sleep(3000);
        // appStore.value.ready = true;
    }
    useEffect(() => {
        console.log("[Tu-app] mounted");
        init();
    }, []);

    return (
        <><Navbar
        site={"Tu yt"}
        ready={true}
        hasLogin={false}
        menuItems={
            <>
            <li className="tu-menu-item"><TuLink to="/video-downloader">Youtube to video</TuLink></li>
            <li className="tu-menu-item"><TuLink to="/audio-downloader">Youtube to audio</TuLink></li>
            </>
        }
    ></Navbar>
    <div className="tu-app">{children}</div>
    <div id="ctx-overlay"></div></>
            
    );
};

export default Layout;
