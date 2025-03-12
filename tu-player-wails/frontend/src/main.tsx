import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import {
    WindowIsMaximised,
    WindowMinimise,
    WindowSetDarkTheme,
    WindowToggleMaximise,
} from "@wailsjs/runtime/runtime";
import { CloseApp } from "@wailsjs/go/main/App";

const titlebar = document.getElementById("titlebar-root")
const minimizeBtn = titlebar.querySelector("#titlebar-minimize")
const maximizeBtn = titlebar.querySelector("#titlebar-maximize")
const closeBtn = titlebar.querySelector("#titlebar-close")

const toggleMaximize = (ev: any) =>{
    WindowToggleMaximise()
    WindowIsMaximised().then(isIt =>{maximizeBtn.innerHTML =`<i class="fi fi-${isIt ? 'sr' : 'br'}-window-maximize"></i>`}).catch(console.log)
}
const init = () => {
    try {
        
        minimizeBtn.addEventListener("click", WindowMinimise)
        maximizeBtn.addEventListener("click", toggleMaximize)
        closeBtn.addEventListener("click", CloseApp)
        console.log({titlebar});
        WindowSetDarkTheme();
    } catch (err) {}
};
init();
// ReactDOM.createRoot(document.getElementById("titlebar-root")).render(
//     <Provider store={store}>
//         <Titlebar
//             leading={
//                 <div className="flex gap-4 items-center">
//                     <TuDropdown trigger={<button>File</button>}>
//                         <button
//                             // onClick={importVideo}
//                             className="tu-menu-item"
//                         >
//                             Import video
//                         </button>
//                         <TuDivider />
//                         <button className="tu-menu-item">Exit</button>
//                     </TuDropdown>
//                     <TuDropdown trigger={<button>Edit</button>}></TuDropdown>
//                 </div>
//             }
//             // title={appState.title}
//             close={CloseApp}
//             minimize={WindowMinimise}
//             toggleMaximize={WindowToggleMaximise}
//             isMaximized={WindowIsMaximised}
//         />
//     </Provider>
// );
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Provider store={store}>
        <App />
    </Provider>
);
