"use client";
import { store } from "@/store";
import { sleep } from "@cmn/utils/funcs";
import Navbar from "@repo/ui-next/components/Navbar";
import TuLink from "@repo/ui-next/components/TuLink";
import { useTuStore } from "@repo/ui-next/store/utils";
import { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const appStore = useTuStore(store.app());

    async function init() {
        await sleep(3000);
        appStore.value.ready = true;
    }
    useEffect(() => {
        console.log("[Tu-app] mounted");
        init();
    }, []);

    return (
        <>
            <Navbar
                site={appStore.value.title}
                ready={appStore.value.ready}
                menuItems={
                    <>
                        <li className="tu-menu-item"><TuLink to="#">Item 1</TuLink></li>
                        <li className="tu-menu-item"><TuLink to="#">Item 2</TuLink></li>
                    </>
                }
            ></Navbar>
            <div className="tu-app">{children}</div>
            <div id="ctx-overlay"></div>
        </>
    );
};

export default Layout;
