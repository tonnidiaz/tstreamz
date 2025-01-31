import { useState } from "react";

export let stores: { [key: string]: [any, (value: any | ((prevState: any) => any)) => void] } = {};

export const createGeminiStore = <T>(name: string, initial: T) => {
    if (!stores[name]) {
        stores[name] = useState(initial);
    }
    return stores[name] as [T, (value: T | ((prev: T) => T)) => void]; // Correctly type the return
};

export const geminiStore = {
    app: () => createGeminiStore('app', { title: 'Tu app', counter: 0 }),
};