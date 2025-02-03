import { appSliceActs, incrVersion, updateState } from "@/redux/reducers/app";
import { RootState } from "@/redux/store";
import { tuImmer } from "@cmn/utils/funcs4";
import { Path } from "@cmn/utils/interfaces";
import UButton from "@repo/ui-next/components/UButton";
import { useStore } from "@repo/ui-next/lib/hooks/redux";
import { useDispatch, useSelector } from "react-redux";


const ReduxComp = () => {
    // const rStore = useSelector((state: RootState) => state['app']);
    // const dispatch = useDispatch();
    const {store: rStore, dispatch} = useStore<RootState>("app")
    
    return (
        <div className="p-4">
            <h1 className="title">Redux comp</h1>
            <div className="mt-4 flex flex-col gap-2">
                <UButton
                    onClick={() => {
                        dispatch(incrVersion());
                    }}
                >
                    Version: {rStore.version}
                </UButton>
                <div className="bordered p-4 flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Username..."
                        value={rStore.user.username}
                        onChange={() => {}}
                        className="input input-sm input-bordered"
                    />
                    <input
                        type="text"
                        placeholder="Car make..."
                        value={rStore.user.car.make}
                        onChange={() => {}}
                        className="input input-sm input-bordered"
                    />
                </div>
                <UButton
                    onClick={() => {
                        dispatch(
                            appSliceActs.setUser(
                                tuImmer(rStore.user, (user) => {
                                    user.username = "Nyamau";
                                })
                            )
                        );
                    }}
                >
                    Change whole state with tuImmer
                </UButton>
                <UButton
                    onClick={() => {
                        dispatch(
                            updateState({path: "user.car.make", value: "Audi"})
                        );
                    }}
                >
                    Change whole state with lodash
                </UButton>
            </div>
        </div>
    );
};

export default ReduxComp;
