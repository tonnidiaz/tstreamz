import { useEffect, useState } from "react";
import { TuState } from "../lib/interfaces";
import TuTeleport from "./TuTeleport";
import TuModalContainer from "./TuModalContainer";
import { useTuState, useTuState0 } from "../lib/hooks";

const TuModal = ({
    open = useTuState(false),
    setOpen,
    children,
    toggler,
    className,
}: {
    open?: TuState<boolean>;
    setOpen?: (v: boolean) => any;
    children?: React.ReactNode;
    toggler?: React.ReactNode;
    className?: string;
}) => {

    // const [_open, _setOpen] = useState(open)

    const id = useTuState0("");
    useEffect(() => {
        id.value = `modal-${Date.now()}`;
    }, []);

    // useEffect(()=>{
    //     console.log({open});
    //     _setOpen(open)}, [open])
    return (
        <div>
            <label
                htmlFor={id.value}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // setOpen?.(true)
                    open.value = true
                }}
            >
                {toggler}
            </label>

            <TuTeleport to="#ctx-overlay">
                <div
                    className={`modal modal-md flex-col flex items-center justify-center ${open.value ? "modal-open" : ""}`}
                >
                    <TuModalContainer open={open} blank>
                        {open.value && (
                            <div className={"modal-box min-w-400 " + className}>
                                {children}
                            </div>
                        )}
                    </TuModalContainer>

                    <label className="modal-backdrop" htmlFor={id.value}>
                        Close
                    </label>
                </div>
            </TuTeleport>
            <input className="checkbox hidden" type="checkbox" />
        </div>
    );
};

export default TuModal;
