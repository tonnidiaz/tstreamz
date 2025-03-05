import { useEffect } from "react";
import "@repo/ui/styles/tw.css";
// import "@repo/ui/styles/tw.scss";
import "@/styles/tw.css";
import "@repo/ui/styles/all.scss";
import "@/styles/main.scss";
import "@flaticon/flaticon-uicons/css/all/all.css";
import Titlebar from "./components/Titlebar";

import { WindowSetTitle } from "wailsjs/runtime/runtime";
import {useSelector} from 'react-redux'
import { RootState } from "./redux/store";
import { handleErrs } from "@cmn/utils/funcs";
import UForm from "@repo/ui-next/components/UForm";
import UInput from "@repo/ui-next/components/UInput";
import UFormGroup from "@repo/ui-next/components/UFormGroup";

function App() {

    const appStore = useSelector((s: RootState)=> s.app)
    useEffect(()=>{
        try {
           if (appStore.title){
            WindowSetTitle(appStore.title)
        } 
        } catch (err) {
            handleErrs(err)
            
        }
        
    }, [appStore.title])
  


    return (
        <>
            <div className="flex-col h-full w-full">
                <Titlebar />
                <div className="tu-app" id="tu-app">
                   <div className="w-full h-full flex-col gap-3 items-center justify-center oy-scroll">
                        <h1 className="tu-title">Tu Wails App</h1>
                        <div className="mt-2">
                            {/* <ul>
                                {Array(50).fill(1).map((el, i)=><li key={`key-${i}`}>Item {el * Date.now()}</li>)}
                            </ul> */}
                            <UForm>
                                <UFormGroup label="App name:"><UInput placeholder="Enter app name..."/></UFormGroup>
                                <UFormGroup label="App version:"><UInput type="number" placeholder="Enter app version..."/></UFormGroup>
                            </UForm>
                            <button className="btn btn-primary">Hello</button>
                        </div>
                   </div>
                </div>
            </div>
        </>
    );
}

export default App;
