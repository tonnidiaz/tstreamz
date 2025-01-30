"use client";

import CtxMenu2 from "@repo/ui/components/CtxMenu2";
// import CtxMenu2 from "@repo/ui/components/CtxMenu2";
import UButton from "@repo/ui/components/UButton";
import UInput from "@repo/ui/components/UInput";
import {
    useTuState,
} from "@repo/ui/lib/tu";
import { useEffect, useMemo, useState } from "react";

const page = () => {
    const cnt3 = useTuState(0);
    const state = useTuState({
        name: "Tonni",
        car: { make: "Honda", model: "Civic", speed: { min: 0, max: 380 } },
    });


    useEffect(() => {
        console.log({ counter: cnt3.value });
        cnt3.value = cnt3.value;
    }, [cnt3.value]);

    const update = (v: number) => {
        cnt3.value += v;
    };

    let name = useTuState("Tonni Diaz")
    return (
        <>
            <title>Fuck dis shit man</title>
            <div className="p-4 border-1 border-card rounded-md w-500px m-auto flex flex-col gap-5">
                <CtxMenu2 toggler={<UButton className="btn-primary">Toggler</UButton>}>
                <ul>
                   <li className="tu-menu-item">Item 1</li>
                    <li className="tu-menu-item">Item 2</li>
                    <li className="tu-menu-item">Item 3</li> 
                </ul>
                    
                </CtxMenu2>
            </div>
        </>
    );
};


export default page;
