import { useTuState } from "./tu";
export type TState<T> = ReturnType<typeof useTuState<T>>;
