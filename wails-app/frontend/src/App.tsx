import "preline/preline";
import "@mobile/ui-next/styles/main.scss";
import { useEffect, useMemo, useState } from "react";
import { IStaticMethods } from "preline/preline";

declare global {
    interface Window {
        HSStaticMethods: IStaticMethods;
    }
}
// import Components from "./components/Components";
import PrelineComponents from "./components/PrelineComponents";
import { handleErrs, sleep } from "@cmn/utils/funcs";
import TuThemeSwitcher from "@mobile/ui-next/components/TuThemeSwitcher";
import { WindowSetTitle,  } from "wailsjs/runtime/runtime";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import Titlebar from "./components/Titlebar";
import { TuButton, TuFormGroup, TuInput } from "@mobile/ui-next/components";
import UForm from "@repo/ui-next/components/UForm";
import { tuImmer } from "@cmn/utils/funcs4";
import { GenKeystore } from "wailsjs/go/main/App";

function App() {
    const appStore = useSelector((s: RootState) => s.app);
    const [formState, setFormState] = useState({
        keystore: "tu-keystore",
        alias: "tu-key0",
        cn: "Tonni Diaz",
        ou: "Tu unit",
        o: "Tu org",
        l: "JHB",
        st: "Gauteng",
        c: "SA",
        pwd: "StorePass444",
        
    });
    useEffect(() => {
        try {
            window.HSStaticMethods.autoInit();
        } catch (err) {
            handleErrs(err);
        }
    });

//     const command = useMemo(
//         () => (saveDir: string) => {
//             return `-genkeypair -v \
// -keystore ${saveDir}/${formState.keystore}.keystore \
// -alias ${formState.alias} \
// -keyalg RSA \
// -keysize 2048 \
// -validity 10000 \
// -dname "CN=${formState.cn}, OU=${formState.ou}, O=${formState.o}, L=${formState.l}, ST=${formState.st}, C=${formState.c}" \
// -storepass ${formState.storePass} \
// -keypass ${formState.keyPass}`;
//         },
//         [formState]
//     );

    useEffect(() => {
        try {
            if (appStore.title) {
                WindowSetTitle(appStore.title);
            }
        } catch (err) {
            handleErrs(err);
        }
    }, [appStore.title]);

    const genKeystore = async () => {
        try {
            const res = await GenKeystore(JSON.stringify(formState));
            console.log({res});
        } catch (err) {
            handleErrs(err);
        }
    };
    return (
        <div className="flex-col flex h-full w-full">
            <Titlebar />
            <div className="tu-app flex-1" id="tu-app">
                <div className="p-4 w-full h-full flex-col gap-3 items-center justify-center oy-scroll">
                    <div className="flex w-full items-center justify-between mb-5">
                        <h1>Tu keystore generator</h1>
                        <TuThemeSwitcher />
                    </div>

                    <UForm
                        onSubmit={genKeystore}
                        className="card flex flex-col gap-2 w-500px m-auto border rounded-lg p-4 border-neutral-700"
                    >
                        <div className="grid grid-cols-2 gap-2">
                            <TuFormGroup
                                label={
                                    <div className="flex gap-2 w-full">
                                        <span>Key store name</span>
                                        <span>(Not the path)</span>
                                    </div>
                                }
                            >
                                <TuInput
                                    value={formState.keystore}
                                    onChange={({ target }) =>
                                        setFormState((s) =>
                                            tuImmer(
                                                s,
                                                (s) =>
                                                    (s.keystore = (
                                                        target as any
                                                    ).value)
                                            )
                                        )
                                    }
                                    required
                                    trailing=".keystore"
                                />
                            </TuFormGroup>
                            <TuFormGroup label="Keytore password">
                                <TuInput
                                    value={formState.pwd}
                                    onChange={({ target }) =>
                                        setFormState((s) =>
                                            tuImmer(
                                                s,
                                                (s) =>
                                                    (s.pwd = (
                                                        target as any
                                                    ).value)
                                            )
                                        )
                                    }
                                    type="password"
                                    required
                                    placeholder="******"
                                />
                            </TuFormGroup>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <TuFormGroup label="Key alias">
                                <TuInput
                                    value={formState.alias}
                                    onChange={({ target }) =>
                                        setFormState((s) =>
                                            tuImmer(
                                                s,
                                                (s) =>
                                                    (s.alias = (
                                                        target as any
                                                    ).value)
                                            )
                                        )
                                    }
                                    required
                                    placeholder="key0"
                                />
                            </TuFormGroup>
                           
                        </div>

                        <TuFormGroup label="Common name">
                            <TuInput
                                required
                                placeholder="Your name or app name..."
                                value={formState.cn}
                                onChange={({ target }) =>
                                    setFormState((s) =>
                                        tuImmer(
                                            s,
                                            (s) =>
                                                (s.cn = (target as any).value)
                                        )
                                    )
                                }
                            />
                        </TuFormGroup>
                        <div className="grid grid-cols-2 gap-2">
                            <TuFormGroup label="Organization Unit">
                                <TuInput
                                    value={formState.ou}
                                    onChange={({ target }) =>
                                        setFormState((s) =>
                                            tuImmer(
                                                s,
                                                (s) =>
                                                    (s.ou = (
                                                        target as any
                                                    ).value)
                                            )
                                        )
                                    }
                                    required
                                    placeholder="Your department..."
                                />
                            </TuFormGroup>
                            <TuFormGroup label="Organization Name">
                                <TuInput
                                    value={formState.o}
                                    onChange={({ target }) =>
                                        setFormState((s) =>
                                            tuImmer(
                                                s,
                                                (s) =>
                                                    (s.o = (
                                                        target as any
                                                    ).value)
                                            )
                                        )
                                    }
                                    required
                                    placeholder="Enter organization name..."
                                />
                            </TuFormGroup>
                        </div>

                        <TuFormGroup label="Locality (City)">
                            <TuInput
                                required
                                value={formState.l}
                                onChange={({ target }) =>
                                    setFormState((s) =>
                                        tuImmer(
                                            s,
                                            (s) => (s.l = (target as any).value)
                                        )
                                    )
                                }
                                placeholder="Enter your city..."
                            />
                        </TuFormGroup>
                        <div className="grid grid-cols-2 gap-2">
                            <TuFormGroup label="State (Province)">
                                <TuInput
                                    required
                                    placeholder="Enter your state..."
                                    value={formState.st}
                                    onChange={({ target }) =>
                                        setFormState((s) =>
                                            tuImmer(
                                                s,
                                                (s) =>
                                                    (s.st = (
                                                        target as any
                                                    ).value)
                                            )
                                        )
                                    }
                                />
                            </TuFormGroup>
                            <TuFormGroup label="Country code (2-letter)">
                                <TuInput
                                    maxLength={2}
                                    minLength={2}
                                    required
                                    placeholder="e.g. US..."
                                    value={formState.c}
                                    onChange={({ target }) =>
                                        setFormState((s) =>
                                            tuImmer(
                                                s,
                                                (s) =>
                                                    (s.c = (
                                                        target as any
                                                    ).value)
                                            )
                                        )
                                    }
                                />
                            </TuFormGroup>
                        </div>
                        <div className="my-2 w-full">
                            <TuButton
                                type="submit"
                                className="w-full"
                                showLoader
                                loading
                            >
                                Generate key
                            </TuButton>
                        </div>
                    </UForm>
                </div>
            </div>
        </div>
    );
}

export default App;
