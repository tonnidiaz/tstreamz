"use client";

import { useEffect, useState } from "react";

// Utility type to safely get deep properties of a nested object
type DeepKey<T> = T extends object
  ? { [K in keyof T]: K extends string | number ? `${K & string}` | `${K & string}.${DeepKey<T[K]>}` : never }[keyof T]
  : undefined;

// Custom hook to implement two-way binding for primitive and nested objects
function useNestedObjectFieldBinding<T>(initialObject: T) {
  const [state, setState] = useState<T>(initialObject);

  const isPremitive = typeof state !== "object"
  const bindField = (path?: DeepKey<T>) => {
    const setValue = (newValue: any) => {
    
        if (isPremitive){setState(newValue); return}
      const keys = path.split('.') as (keyof T)[];
      setState((prevState: any) => {
        let updatedState = { ...prevState };
        let tempState = updatedState;

        // Traverse the path until we reach the target field
        keys.forEach((key, index) => {
          // If we're at the last key and it's a primitive, update it directly
          if (index === keys.length - 1) {
            tempState[key] = newValue;
          } else {
            // Otherwise, create a shallow copy of the current object
            tempState[key] = { ...tempState[key] };
            tempState = tempState[key];
          }
        });

        return updatedState;
      });
    };

    const value = keysExist(state, path) ? path.split('.').reduce((obj: any, key: string) => obj[key], state) : state;

    return {
      value,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value),
    };
  };

  // Utility function to check if a path exists in the object (handles primitives too)
  const keysExist = (obj: any, path: string) => {
    if (!path) return false
    const keys = path.split('.');
    let temp = obj;
    for (let key of keys) {
      if (temp && key in temp) {
        temp = temp[key];
      } else {
        return false;
      }
    }
    return true;
  };

  return [state, bindField] as const;
}


export default function page() {
    // const [state, bindState] = useNestedObjectFieldBinding({
    //     name: "Tonni Diaz",
    // });
    const [name, bindName] = useNestedObjectFieldBinding("Marco Pollo");
    
    return (
        <div className="p-4">
            <div className="p-2">
                <h2 className="he">Binding</h2>
                {/* {JSON.stringify(state)} */}
                <input
                    type="text"
                    className="input input-sm input-bordered"
                    placeholder="Bind this..."
                    // {...bindState("name")}
                />
            </div>
            <div className="p-2">
                <h2 className="he">Binding premitive</h2>
                {JSON.stringify(name)}
                <input
                    type="text"
                    className="input input-sm input-bordered"
                    placeholder="Bind this..."
                    {...bindName()}
                />
            </div>
        </div>
    );
}
