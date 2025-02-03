import React, { useState, useEffect } from "react";
import { useTuState0, useTuState } from "../../lib/hooks";
import { TuState } from "@repo/ui-next/lib/interfaces";

// Store container
export const stores: { [key: string]: { get: any; set: any; subscribe: any } } =
    {};

// Utility to create a global store
export const createTuStore = <T>(name: string, initial: T) => {
    if (!stores[name]) {
        console.log(`\nNEW STORE: [${name}]`);
        let value = initial;
        const listeners: Array<(val: T) => void> = [];

        // Getter
        const get = () => value;

        // Setter
        const set = (newValue: T) => {
            if (newValue !== value) {
                value = newValue;
                listeners.forEach((listener) => listener(value));
            }
        };

        // Subscribe to changes
        const subscribe = (listener: (val: T) => void) => {
            listeners.push(listener);
            return () => {
                const index = listeners.indexOf(listener);
                if (index > -1) listeners.splice(index, 1);
            };
        };

        stores[name] = { get, set, subscribe };
    }

    return stores[name] as {
        get: () => T;
        set: (val: T) => void;
        subscribe: (listener: (val: T) => void) => () => void;
    };
};

// Hook to use a global store in React components
export const useTuStore0 = <T>(store: {
    get: () => T;
    set: (val: T) => void;
    subscribe: any;
}) => {
    const [state, setState] = useState(store.get());
    const _state = useTuState0(state);
    useEffect(() => {
        // Subscribe to store updates
        const unsubscribe = store.subscribe(setState);
        return () => unsubscribe(); // Cleanup on unmount
    }, [store]);

    useEffect(() => {
        store.set(_state.value);
    }, [_state.value]);

    return {
        get value() {
            return state;
        },
        set value(newVal: T) {
            _state.value = newVal;
        },
    };
};
// Hook to use a global store in React components
export const useTuStore = <T>(store: {
    get: () => T;
    set: (val: T) => void;
    subscribe: any;
}) => {
    const [state, setState] = useState(store.get());
    const _state = useTuState(state);
    useEffect(() => {
        // Subscribe to store updates
        const unsubscribe = store.subscribe(setState);
        return () => unsubscribe(); // Cleanup on unmount
    }, [store]);

    useEffect(() => {
        store.set(_state.value);
    }, [_state.value]);

    return {
        get value() {
            return state;
        },
        set value(newVal: T) {
            _state.value = newVal;
        },
    };
};
