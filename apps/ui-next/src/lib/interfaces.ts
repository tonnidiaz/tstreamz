import { $state } from "./tu";

export interface ISelectItem {label: string, value: any, disabled?: boolean; class?: string; html?: string}
export type TState<T> = ReturnType<typeof $state<T>>;
