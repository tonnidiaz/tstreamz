import '@mobile/ui-next/styles/main.scss'
import Components from "./components/Components";
import TuThemeSwitcher from "./components/TuThemeSwitcher";
import { tuImmer } from '@cmn/utils/funcs4';
import { Path } from "@cmn/utils/interfaces";
function App() {
 tuImmer
 let v: Path<any> | undefined
    return (
        <div className="p-4">
            <div className="flex w-full items-center justify-between">
                 <h1></h1>
                 <TuThemeSwitcher/>
            </div>
           
            <div className="card flex flex-col gap-4">
                <Components/>
            </div>
           
        </div>
    );
}

export default App;
