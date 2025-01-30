import { useEffect, useMemo, useState } from "react";

// export function $state<T extends any>(initialState: T): T {
//     const [state, setState] = useState(initialState);

//     const createReactiveState = (currentState: any): any => {
//         // if (typeof currentState !== "object" || currentState === null) {
//         //     return currentState; // Return primitives as is
//         // }
//         return new Proxy(currentState, {
//             get(target, prop) {
//                 const value = target[prop];
//                 // If the value is an object, recursively wrap it in a Proxy
//                 return typeof value === "object" && value !== null
//                     ? createReactiveState(value)
//                     : value;
//             },
//             set(target, prop, value) {
//                 if (typeof target !== "object") target = value
//                 else
//                 target[prop] = value; // Update the target directly
//                 setState((prevState) => structuredClone(prevState)); // Trigger state update
//                 return true; // Indicate success
//             },
//         });
//     };

//     return createReactiveState(state);
// }
export function $gstate<T>(initialValue: T): { value: T } {
    const [state, setState] = useState({ value: initialValue });

    return new Proxy(state, {
        set: (
            target: { value: T },
            prop: string | symbol,
            value: any
        ): boolean => {
            if (
                typeof target.value[prop as keyof T] === "object" &&
                target.value[prop as keyof T] !== null
            ) {
                target.value[prop as keyof T] = {
                    ...target.value[prop as keyof T],
                    ...value,
                };
            } else {
                target.value[prop as keyof T] = value;
            }
            setState({ ...target });
            return true;
        },
    });
}

export function fn<T>(initial: T) {
    let v = $gstate(5);
}
// export function $state2<T>(initialValue: T): T {
//     const isPremitive = typeof initialValue !== "object";
//     const val = !isPremitive ? initialValue : { value: initialValue };
//     const [state, setState] = useState<T>(initialValue);

//     return new Proxy(isPremitive ? {value: state} : state as any, {
//         get: (target: T, prop: string | symbol): any => {
//             console.log(`\nGetting property: ${String(prop)}`); // Log property access
//             const value = Reflect.get(target as any, prop);
//             // Modify the value before returning (example: uppercase string)
//             if (typeof value === 'string') {
//               return value.toUpperCase();
//             }
//             return value;
//           },
//         set: (target: T, prop: string | symbol, value: any): boolean => {
//             if (isPremitive) {
//                 console.log({target});
//                 target = value;
//             } else if (
//                 typeof target[prop as keyof T] === "object" &&
//                 target[prop as keyof T] !== null
//             ) {
//                 target[prop as keyof T] = {
//                     ...target[prop as keyof T],
//                     ...value,
//                 };
//             } else {
//                 target[prop as keyof T] = value;
//             }
//             setState({ ...target });
//             return true;
//         },
//     });
// }

// export function $state0<T>(initialValue: T): { value: T } {
//     const proxy = new Proxy({ value: initialValue }, {
//       set(target, prop, value) {
//         if (prop === "value") {
//           target.value = value; // Update state
//           render(); // Trigger React re-render (this is for demonstration)
//           return true;
//         }
//         return false;
//       },
//       get(target, prop) {
//         return target[prop as keyof typeof target];
//       },
//     });

//     function render() {
//       // Rerender React components - normally React's `setState` would handle this
//       setTimeout(() => {
//         const event = new CustomEvent("forceUpdate");
//         window.dispatchEvent(event);
//       }, 0);
//     }

//     return proxy;
//   }
export function $state<T>(initial: T) {
    const [state, setState] = useState(initial);
    return { value: state, set: (cb: (state?: T) => T) => setState(cb(state)) };
}

// export class TuState<T> {
//     state: ReturnType<typeof useState<T>>;
//     constructor(initial: T) {
//         this.state = useState(initial);
//     }
//     get value() {
//         return this.state[0];
//     }
//     set value(v: T) {
//         this.state[1](v);
//     }

// }
export class TuState<T> {
    private _state: [T, React.Dispatch<React.SetStateAction<T>>];
  
    constructor(initial: T) {
      this._state = useState(initial);
      // Create a Proxy to handle nested updates and make it reactive
      return new Proxy(this, {
        get: (target, prop) => {
          if (prop === "value") {
            return target._state[0];
          }
          return target[prop];
        },
        set: (target, prop, value) => {
          if (prop === "value") {
            target._state[1](value);
            return true;
          }
          return false;
        },
      });
    }
  
    get value(): T {
      return this._state[0];
    }
  
    set value(newValue: T) {
      this._state[1](newValue);
    }
  }
// export function useTuState<T>(initial: T) {
//     const [value, setValue] = useState(initial);
  
//     return {
//       get value() {
//         return value;
//       },
//       set value(v: T) {
//         console.log({v});
//         setValue(v);
//       },
//       increment(by = 1) {
//         setValue((prev: any) => prev + by); // Function-based update
//       },
//     };
//   }
  

// export function useTuState<T>(initial: T) {
//     const [value, setValue] = useState(initial);
  
//     return new Proxy(
//       { value, setValue },
//       {
//         get(target, prop) {
//           if (prop === "value") return target.value;
//           return target[prop];
//         },
//         set(target, prop, newValue) {
//           if (prop === "value") {
//             target.setValue((prev) => (typeof newValue === "function" ? newValue(prev) : newValue));
//           }
//           return true;
//         },
//       }
//     );
//   }
export function useTuState<T>(initial: T) {
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