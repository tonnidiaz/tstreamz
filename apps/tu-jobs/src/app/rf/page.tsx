"use client";

import { store } from "@/store";
import { useTuStore } from "@/store/utils";
import { proxyStore } from "@/store/utils/proxy";
import { $obj } from "@cmn/utils/funcs4";
import CtxMenu2 from "@repo/ui-next/components/CtxMenu2";
import TuPaginator from "@repo/ui-next/components/TuPaginator";
import TuSelect from "@repo/ui-next/components/TuSelect";
import UAccordion from "@repo/ui-next/components/UAccordion";
// import CtxMenu2 from "@repo/ui-next/components/CtxMenu2";
import UButton from "@repo/ui-next/components/UButton";
import UFormGroup from "@repo/ui-next/components/UFormGroup";
import UInput from "@repo/ui-next/components/UInput";
import { useTuState } from "@repo/ui-next/lib/tu";
import { useEffect, useMemo, useState } from "react";

const page = () => {

    const [appStore, setStore, _state] = useTuStore(store.app());
    const state = useTuState(appStore)

    useEffect(()=>{
        setStore(state.value)
    }, [state.value])
    // useEffect(() => {
    //     console.log(appStore.value);
    // }, []);

    const selectState = {
        val: useTuState("tonni"),
        options: ["David", "Diaz", "Squash", "Tonni", "Manizo"],
    };

    return (
        <>
            <title>Fuck dis shit man</title>
            <div className="p-4 border-1 border-card rounded-md w-500px m-auto flex flex-col gap-3">
                {/* <h1 className="title">{appStore.value.title}</h1> */}
                <CtxMenu2
                    toggler={<UButton className="btn-primary">Toggler</UButton>}
                >
                    <ul>
                        <li className="tu-menu-item">Item 1</li>
                        <li className="tu-menu-item">Item 2</li>
                        <li className="tu-menu-item">Item 3</li>
                    </ul>
                </CtxMenu2>
                <TuSelect
                    value={selectState.val}
                    options={selectState.options.map((el) => ({
                        label: el,
                        value: el.toLowerCase(),
                    }))}
                ></TuSelect>
                <UFormGroup label="App name">
                    <UInput
                        placeholder="Enter app name..."
                        value={state.value.title}
                        onChange={({ target }) => {
                            console.log("On change", target.value);
                            state.value.title = target.value;
                        }}
                    />
                </UFormGroup>
                <UFormGroup label="App name (_state):">
                    <UInput
                        placeholder="Enter app name..."
                        value={_state.value.title}
                        onChange={({ target }) => {
                            console.log("On change", target.value);
                            _state.value.title = target.value;
                        }}
                    />
                </UFormGroup>
               <button onClick={()=>{
                setStore({...appStore, counter: appStore.counter + 1})}} className="btn btn-sm btn-primary">Speed: {appStore.counter}</button>
               <button onClick={()=>{_state.value.counter += 1}} className="btn btn-sm btn-secondary">Speed: {_state.value.counter}</button>
                <TuPaginator page={useTuState(8)} total={20} />
                <UAccordion label={<h1>Accordion label</h1>}>
                    <div className="p-3">Some accordion content</div>
                </UAccordion>
            </div>
        </>
    );
};

export default page;
