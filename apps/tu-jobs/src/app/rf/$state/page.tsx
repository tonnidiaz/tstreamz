"use client";
import { IObj } from "@cmn/utils/interfaces";
import { $state0 } from "@repo/ui/lib/tu";
import React, { useState, useEffect } from "react";
function useStateWithProxy<T extends object>(initialValue: T): T {
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

function ParentComponent() {
    const person = $state0({ name: "John Doe", age: 30 });

    useEffect(() => {
        console.log("ParentComponent:", person);
    }, [person]);

    return (
        <div className="p-4 flex flex-col gap-4px">
            <p>ParentComponent:</p>
            <p>Name: {person.value.name}</p>
            <p>Age: {person.value.age}</p>
            <ChildComponent person={person} />
        </div>
    );
}

function ChildComponent({ person } : {person: IObj}) {
    useEffect(() => {
        console.log("ChildComponent:", person.value);
    }, [person]);

    const handleChange = () => {
        // Modify the person object directly
        person.value.name = "Jane Doe";
        person.value.age = 25;
    };

    return (
        <div>
            <p>ChildComponent:</p>
            <p>Name: {person.value.name}</p>
            <p>Age: {person.value.age}</p>
            <button onClick={handleChange}>Change Person</button>
        </div>
    );
}

export default ParentComponent;
