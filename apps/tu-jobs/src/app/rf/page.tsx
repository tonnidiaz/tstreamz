"use client";

// import CtxMenu2 from "@repo/ui/components/CtxMenu2";
import UButton from "@repo/ui/components/UButton";
import UInput from "@repo/ui/components/UInput";
import { $gstate, $state, TuState, useTuState } from "@repo/ui/lib/tu";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";

const page = () => {
    const cnt = $state(0);
    let cnt2 = $gstate(0)
    const cnt3 = useTuState(0)
    const state = useTuState({
        name: "Tonni", car: {make: "Honda", model: "Civic", speed: {min: 0, max: 380}}
    })

    useEffect(()=>{
        console.log({counter: cnt3.value});
        cnt3.value = cnt3.value
    }, [cnt3.value])

    const update = (v: number)=>{
        cnt3.value += v
    }
    return (
        <><title>Fuck dis shit man</title>
         <div className="p-4 border-1 border-card rounded-md w-500px m-auto flex flex-col gap-5px">
            
            <UButton onClick={_=>cnt.set(v=> v + 1)} className="btn-secondary">Counter {cnt.value}</UButton>
            <UButton onClick={_=>cnt2  = {value: 6}} className="btn-accent">Counter2 {cnt2.value}</UButton>
            <button onClick={_=>{cnt3.value += 1}} className="btn btn-sm btn-primary">Counter3 {cnt3.value}</button>
            <p className="text-primary">
                {JSON.stringify(state.value)}
            </p>

            <h3>Change stuff</h3>
            <button onClick={()=>{
                state.value = {...state.value, name: "Diaz"}
            }} className="btn btn-sm btn-primary">Change</button>
            <input className="input input-sm input-bordered" value={state.value.name} onChange={e=> state.value.name = e.target.value} placeholder="Name"/>
            <input className="input input-sm input-bordered" value={state.value.car.make} onChange={e=> state.value.car.make = e.target.value} placeholder="Car make"/>
            <input className="input input-sm input-bordered" value={state.value.car.model} onChange={e=> state.value.car.model = e.target.value} placeholder="Car model"/>
            <input type="number" className="input input-sm input-bordered" value={state.value.car.speed.min} onChange={e=> state.value.car.speed.min = Number(e.target.value)} placeholder="Car speed min"/>
            <input type="number" className="input input-sm input-bordered" value={state.value.car.speed.max} onChange={e=> state.value.car.speed.max = Number(e.target.value)} placeholder="Car speed max"/>
            {/* <CtxMenu2
                toggler={<UButton className="btn-primary">Toggle</UButton>}
            >
                <div className="p-3">
                    <ul>
                        <li className="tu-menu-item">Hello</li>
                        <li className="tu-menu-item">World</li>
                    </ul>
                </div>
            </CtxMenu2> */}
        </div>
        </>
       
    );
};

export default page;
