"use client";
import { useTuState } from "@repo/ui-next/lib/tu";
import UButton from "@repo/ui-next/components/UButton";
import { sleep } from "@cmn/utils/funcs";
import { showToast } from "@cmn/utils/funcs-ui";

export default function Home() {
    let person = useTuState({
        name: "Tonni Diaz",
        age: 23,
        chick: {
            name: "Andzani",
            age: 14,
            car: { make: "Honda", model: "Civik" },
        },
    });

    let name = useTuState("Johannah")
    return (
        <div className="w-full">
            <div className="flex flex-col gap-8px p-4 w-500px m-auto">
                <h1>Hello world</h1>
                <p>
                    This is <b>{name.value}</b>
                </p>
                <input className="input input-sm input-bordered" value={name.value} onChange={({target})=> name.value = target.value}/>
                <button className="btn btn-secondary btn-sm">I am button</button>
                <UButton className="btn-primary" onClick={async _=>{
                    await sleep(300);
                    showToast({msg: "Button clicked"})
                }}>I am a button too</UButton>
            </div>
            
        </div>
    );
}


const TestInp = ({value}: {value: any}) =>{
    return <input className="input input-sm input-bordered" type="text" defaultValue={value} onChange={({target})=> value = target.value} />
}