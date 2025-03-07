import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { WindowSetDarkTheme } from "@wailsjs/runtime/runtime";


const init = () => {
    try {
       WindowSetDarkTheme() 
    } catch (err) {
        
    }
}
init()
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Provider store={store}>
        <App />
    </Provider>
);

