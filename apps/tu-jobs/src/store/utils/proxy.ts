import { useRef, useState } from "react";


// Global object to store states
export const stores: { [key: string]: any } = {};

// Create or get a store
const createStore = <T extends object>(name: string, initial: T) => {
    // Always call useState on every render
    const store = useRef(stores[name]);
  
    // Only initialize the store if it hasn't been created yet
    if (!store.current) {
      console.log("Initializing store:", name);
  
      // Initialize the state for the store
      const [state, setState] = useState(initial);
  
      // Create a proxy to handle nested updates and trigger re-renders
      const proxy = new Proxy(state, {
        set(target, key, value) {
          // Direct mutation is avoided; a new object is created to trigger re-render
          const newState = { ...target, [key as keyof T]: value };
          setState(newState); // Trigger re-render
          return true;
        },
      });
  
      store.current = {
        value: proxy,
        setState,
      };
  
      // Save the store reference globally
      stores[name] = store.current;
    }
  
    return store.current;
  };
// Exporting `store` for accessing global stores
export const proxyStore = {
  app: () => createStore("app", { title: "MY app", counter: 0 }),
};
