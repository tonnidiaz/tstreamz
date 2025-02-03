import { Path } from "@cmn/utils/interfaces"
import {useDispatch, useSelector} from "react-redux"

export const useStore = <TState extends object>(name: keyof TState)=> {
    const store = useSelector((state: TState) => state[name]);
    const dispatch = useDispatch()
    return {store, dispatch}
}