"use client";
import { store } from "@/store";
import { useTuStore } from "@/store/utils";
// import { store, stores } from "@/store/app";
import UInput from "@repo/ui-next/components/UInput";
import { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [state, setState]= useTuStore(store.app());
  
    // useEffect(()=>{
    //     console.log(proxyState.value);
    // },[])
    // useEffect(()=>{
    //     console.log(_appStore[0].title);
    // }, [_appStore[0]])

    return (
        <>
            <div className="navbar">
                <h1 className="ttl">App: {state.title}</h1>
                <UInput
                    placeholder="Enter app name..."
                    value={state.title}
                    onChange={({ target }) => {
                        // console.log('On change', target.value);
                        state.title = target.value;
                        // setState({...state, title: target.value})
                    }}
                />
            </div>
            <div className="tu-app">
                <div className="flex flex-col gap-2">
                    <h1 className="ttl">Proxy app: {state.title}</h1>
                    <UInput
                        placeholder="Enter app name..."
                        value={state.title}
                        onChange={({ target }) => {
                            setState({...state, title: target.value});
                        }}
                    />
                </div>
                {children}
            </div>

            <div id="ctx-overlay"></div>
        </>
    );
};

export default Layout;
