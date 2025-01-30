import { useState } from "react";

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
export function $gstate <T extends object>(initialValue: T): T {
    const [state, setState] = useState<T>(initialValue);
  
    return new Proxy(state, {
      set: (target: T, prop: string | symbol, value: any): boolean => {
        if (typeof target[prop as keyof T] === 'object' && target[prop as keyof T] !== null) {
          target[prop as keyof T] = {
            ...target[prop as keyof T],
            ...value,
          };
        } else {
          target[prop as keyof T] = value;
        }
        setState({ ...target });
        return true;
      },
    });
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
    const [state, setState] = useState(initial)
    return {value: state, set: (cb: (state?: T)=>T)=> setState(cb(state))}
}


