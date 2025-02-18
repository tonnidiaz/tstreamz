import { useState } from "react"

export function useTuState<T>(initial: T){
    const [state, setState] = useState<T>(initial)
    return {get value(){return state}, set value(v){setState(v)}}
}

export type TuState<T> = ReturnType<typeof useTuState<T>>