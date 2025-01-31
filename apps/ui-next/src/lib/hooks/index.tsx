import { useContext, createContext } from "react";
import { useTuState } from "../tu";

// Define the shape of your global state (optional)
type GlobalStateType = {
    user: {
      name: string;
      details: {
        age: number;
        location: string;
      };
    };
  };
  
  // Create the context
  const GlobalStateContext = createContext<ReturnType<typeof useTuState<GlobalStateType>> | null>(
    null
  );
  
  // Global State Provider Component
  export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize your global state using `useTuState`
    const state = useTuState<GlobalStateType>({
      user: {
        name: "Tonni",
        details: {
          age: 25,
          location: "Earth",
        },
      },
    });
  
    return (
      <GlobalStateContext.Provider value={state}>
        {children}
      </GlobalStateContext.Provider>
    );
  };
  
  // Custom Hook to Access Global State
  export const useTuStore = () => {
    const context = useContext(GlobalStateContext);
    if (!context) {
      throw new Error("useTuStore must be used within a GlobalStateProvider");
    }
    return context;
  };