import "preline/preline";
import "@mobile/ui-next/styles/main.scss"
import { useEffect, useState } from "react";
import { IStaticMethods } from "preline/preline";

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}
// import Components from "./components/Components";
import PrelineComponents from "./components/PrelineComponents";
import { handleErrs } from "@cmn/utils/funcs";
import TuThemeSwitcher from "@mobile/ui-next/components/TuThemeSwitcher";

function App() {

  useEffect(() => {
    try {
       window.HSStaticMethods.autoInit(); 
    } catch (err) {
        handleErrs(err)
    }
    
  });
    return (
        <div className="p-4">
            <div className="flex w-full items-center justify-between">
                 <h1>Vite + React</h1>
                 <TuThemeSwitcher/>
            </div>
           
            <div className="card flex flex-col gap-4">
                {/* <Components/> */}
                <PrelineComponents/>
            </div>
         
        </div>
    );
}

export default App;
