"use client";

import LinksComponent from "@/components/LinksComponent";
import { store } from "@/store";
import { getUsers } from "@/utils/server/funcs";

import { sleep } from "@cmn/utils/funcs";
import CtxMenu2 from "@repo/ui-next/components/CtxMenu2";
import TMeta from "@repo/ui-next/components/TMeta";
import TuPaginator from "@repo/ui-next/components/TuPaginator";
import TuSelect from "@repo/ui-next/components/TuSelect";
import UAccordion from "@repo/ui-next/components/UAccordion";
import UButton from "@repo/ui-next/components/UButton";
import UFormGroup from "@repo/ui-next/components/UFormGroup";
import UInput from "@repo/ui-next/components/UInput";
import { useTuState } from "@repo/ui-next/lib/hooks";
import { useTuStore } from "@repo/ui-next/store/utils";

const page = () => {
    const appStore = useTuStore(store.app());
    const selectState = {
        val: useTuState("tonni"),
        options: ["David", "Diaz", "Squash", "Tonni", "Manizo"],
    };

    return (
        <>
            <TMeta title="Tu app mongwaneng" />
            <div className="p-4 border-1 border-card rounded-md w-500px m-auto flex flex-col gap-3">
                <LinksComponent/>
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
      
                <UFormGroup label="App name (_state):">
                    <UInput
                        placeholder="Enter app name..."
                        value={appStore.value.title}
                        onChange={({ target }) => {
                            console.log("On change", target.value);
                            appStore.value.title = target.value;
                        }}
                    />
                </UFormGroup>
           
                <UButton
                    onClick={async () => {
                        await sleep(2000);
                        appStore.value.counter += 1;
                    }}
                    className="btn btn-sm btn-secondary"
                >
                    Speed: {appStore.value.counter}
                </UButton>
                <TuPaginator page={useTuState(8)} total={20} />
                <UAccordion label={<h1>Accordion label</h1>}>
                    <div className="p-3">Some accordion content</div>
                </UAccordion>

                <UButton className="btn-secondary" onClick={async ()=>console.log(await getUsers())}>Get users</UButton>
            </div>
        </>
    );
};

export default page;
