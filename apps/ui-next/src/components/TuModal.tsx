import { useEffect } from "react";
import { useTuState } from "../lib/tu";
import { TState } from "../lib/interfaces";
import TuTeleport from "./TuTeleport";
import TuModalContainer from "./TuModalContainer";

const TuModal = ({
    open = useTuState(false),
    content,
    toggler,
    className,
}: {
    open?: TState<boolean>;
    content?: React.ReactNode;
    toggler?: React.ReactNode;
    className?: string;
}) => {
    const id = useTuState("");
    useEffect(() => {
        id.value = `modal-${Date.now()}`;
    }, []);
    return (
        <div>
            <label
                htmlFor={id.value}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    open.value = true;
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
                                {content}
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
