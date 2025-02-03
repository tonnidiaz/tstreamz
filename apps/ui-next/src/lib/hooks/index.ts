import { useEffect, useMemo, useState } from "react";

export function useTuState0<T>(initial?: T) {
    const [state, setState] = useState(initial);
  
    // Recursive Proxy creation
    const createProxy = (target: any, path: (string | number)[]): any => {
      if (typeof target === "object" && target !== null) {
        return new Proxy(target, {
          get(obj, prop) {
            const value = obj[prop as keyof typeof obj];
            // Recursively wrap nested objects
            return typeof value === "object" && value !== null
              ? createProxy(value, [...(path as any), (prop as any)])
              : value;
          },
          set(obj, prop, newValue) {
            const updatedState = updateNestedValue(state, [...(path as any), (prop as any)], newValue);
            setState(updatedState);
            return true;
          },
        });
      }
      return target; // Return primitives as-is
    };
  
    // Update the state immutably at the given path
    const updateNestedValue = (current: any, path: (string | number)[], value: any) => {
      if (path.length === 0) return value;
      const [key, ...rest] = path;
      return Array.isArray(current)
        ? Object.assign([...current], { [key]: updateNestedValue(current[key], rest, value) })
        : Object.assign({}, current, { [key]: updateNestedValue(current[key], rest, value) });
    };
  
    const proxy = useMemo(() => createProxy(state, []), [state]);
  
    return {
      get value() {
        return proxy;
      },
      set value(newValue: T) {
        setState(newValue);
      },
    };
  }

  export function useTuState<T>(initial?: T) {
      const [state, setState] = useState(initial);
  
      const createDeepProxy = (target: any, path: (string | number)[] = []): any => {
          if (typeof target === "object" && target !== null) {
              return new Proxy(target, {
                  get(obj, prop) {
                      const value = obj[prop as keyof typeof obj];
                      const newPath = [...path, prop]; // Include current prop in path
                      return createDeepProxy(value, newPath as any); // Recursive call
                  },
                  set(obj, prop, newValue) {
                      const updatedState = updateNestedValue(state, [...path as any, prop as any], newValue);
                      setState(updatedState);
                      return true;
                  },
              });
          }
          return target;
      };
  
      const updateNestedValue = (current: any, path: (string | number)[], value: any) => {
          if (path.length === 0) return value;
  
          const [key, ...rest] = path;
          const isArray = Array.isArray(current);
  
          const updatedCurrent = isArray ? [...current] : { ...current };
  
          updatedCurrent[key as keyof typeof updatedCurrent] = updateNestedValue(current[key as keyof typeof current], rest, value);
  
          return updatedCurrent;
      };
  
      const proxy = useMemo(() => createDeepProxy(state), [state]);
  
      return {
          get value() {
              return proxy;
          },
          set value(newValue: T) {
              setState(newValue);
          },
      };
  }
  
  // ... (rest of your code: createTuStore, useTuStore, store)