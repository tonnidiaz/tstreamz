import { useTuState } from "@repo/ui-next/lib/tu";
import React, { useState, useEffect } from "react";

// Store container
export const stores: {
    [key: string]: {
      get: any;
      set: any;
      subscribe: any;
    };
  } = {};
  
  // Utility to create a global store
  export const createTuStore = <T>(name: string, initial: T) => {
    if (!stores[name]) {
      let value = initial;
      const listeners: Array<(val: T) => void> = [];
  
      // Getter
      const get = () => value;
  
      // Setter
      const set = (newValue: T) => {
        value = newValue;
        listeners.forEach((listener) => listener(value));
      };
  
      // Subscribe to changes
      const subscribe = (listener: (val: T) => void) => {
        listeners.push(listener);
        return () => {
          const index = listeners.indexOf(listener);
          if (index > -1) listeners.splice(index, 1);
        };
      };
  
      // Wrap value in a Proxy for nested reactivity
      const createProxy = (obj: any): any => {
        return new Proxy(obj, {
          get(target, prop) {
            const value = target[prop];
            if (typeof value === "object" && value !== null) {
              return createProxy(value); // Wrap nested objects
            }
            return value;
          },
          set(target, prop, newValue) {
            target[prop] = newValue;
            set({ ...value }); // Replace with a new reference
            return true;
          },
        });
      };
  
      stores[name] = {
        get: () => createProxy(value),
        set,
        subscribe,
      };
    }
  
    return stores[name] as {
      get: () => T;
      set: (val: T) => void;
      subscribe: (listener: (val: T) => void) => () => void;
    };
  };
  
  // Hook to use a global store in React components
  export const useTuStore = <T>(store: {
    get: () => T;
    set: (val: T) => void;
    subscribe: (listener: (val: T) => void) => () => void;
  }) => {
    const [state, setState] = React.useState(store.get());
  
    React.useEffect(() => {
      // Subscribe to store updates
      const unsubscribe = store.subscribe(setState);
      return () => unsubscribe(); // Cleanup on unmount
    }, [store]);
  
    return {
      get value() {
        return state;
      },
      set value(newValue: T) {
        store.set(newValue);
      },
    };
  };
  