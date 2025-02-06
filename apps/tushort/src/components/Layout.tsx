"use client";
import { store as tuStore } from "@/store";
import Navbar from "@repo/ui-next/components/Navbar";
import
UButton from "@repo/ui-next/components/UButton";
import { useTuStore0, useTuStore } from "@repo/ui-next/store/utils";
import { useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux'
import { RootState } from "@/redux/store";
import { incrVersion } from "@/redux/reducers/app";
const Layout = ({ children }: { children: React.ReactNode }) => {
    const appStore = useTuStore0(tuStore.app());
    const appStore2 = useTuStore(tuStore.app2());

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
        site={appStore.value.title}
        ready={true}
        hasLogin={false}
        menuItems={
            <>
            <UButton onClick={()=>{dispatch(incrVersion())}}>Version: {rStore.version}</UButton>
            {/* <UButton className="" onClick={()=> appStore.value = {...appStore.value, counter: appStore.value.counter + 1}}>Counter: {appStore.value.counter}</UButton>
            <UButton className="" onClick={()=> appStore2[1]({...appStore2[0], counter: appStore2[0].counter + 1})}>Counter#2: {appStore2[0].counter}</UButton>

                <li className="tu-menu-item"><TuLink to="#">Item 1</TuLink></li>
                <li className="tu-menu-item"><TuLink to="#">Item 2</TuLink></li> */}
            </>
        }
    ></Navbar>
    <div className="tu-app">{children}</div>
    <div id="ctx-overlay"></div></>
            
    );
};

export default Layout;
