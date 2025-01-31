import { IObj } from "@cmn/utils/interfaces";
import { TState } from "@repo/ui-next/lib/interfaces";
import { useTuState } from "@repo/ui-next/lib/tu";
import { useState } from "react";
export let stores : {[key: string] : ReturnType<typeof useState<any>>} = {

}
const createStore = <T>(name: string, initial: T) =>{
    if (!stores[name]){
        stores[name] = useState(initial);
     };
    return stores[name] as ReturnType<typeof useState<T>>
}
export const store = {
    app: ()=> createStore('app', {title: 'Tu app', counter: 0})
}

// export type TAppStore = ReturnType<typeof store.app