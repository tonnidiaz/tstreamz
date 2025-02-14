import {
    ButtonHTMLAttributes,
    HTMLAttributes,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { handleErrs } from "@cmn/utils/funcs";

interface IProps extends ButtonHTMLAttributes<any> {
    loading?: boolean;
    showLoader?: boolean;
}
const UButton = ({
    children,
    loading,
    showLoader,
    className,
    type: _type,
    disabled,
    onClick,
    ...props
}: IProps) => {
    const el = useRef<HTMLButtonElement>(null);
    const [_loading, setLoading] = useState(loading || className?.includes("btn-loading"))

    let submitHandler: Function;

    async function interceptFormSubmit(btn: HTMLButtonElement) {
        try {
            if (_type == "submit") {
                const form = btn.form;
                if (!form) {
                    console.log("No form");
                    return;
                }
                // console.log(btn);

                const listener = async (e) => {
                    e.preventDefault();
                    const formSubmit = btn.form.onsubmit;
                    if (formSubmit && !submitHandler) {
                        submitHandler = formSubmit;

                        btn.form.onsubmit = (e) => e.preventDefault();
                        btn.form.onsubmit = undefined;
                    } else if (submitHandler) {
                        console.log("Custom submit");
                    }
                    btn.form.removeEventListener("submit", listener);
                };
                btn.form.addEventListener("submit", listener);
                btn.form.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    console.log("Custom listener");
                    const event = new Event("submit", {
                        bubbles: true,
                        cancelable: true,
                    });
                    // Dispatch the event on the form element
                    const isDefaultPrevented = true; //!btn.form.dispatchEvent(event);
                    if (isDefaultPrevented)
                        // Invoke the onsubmit callback
                        await caller(
                            async () =>
                                await submitHandler.call(btn.form, event)
                        );
                });
            }
        } catch (err) {
            handleErrs(err);
        }
    }

    async function caller(cb: Function) {
        try {
            setLoading(true);
            el.current.classList.add("disabled")//.disabled = true;
            await cb();
        } catch (err) {
            console.log("[UButton] caller() error", err);
            handleErrs(err);
        } finally {
            // console.log('Finally');
            if (!el) return;
            el.current.classList.remove("disabled")//.disabled = false;
            setLoading(false);
        }
    }
    async function handleClick(this: HTMLButtonElement, ev: MouseEvent) {
        await caller(async () => await onClick?.(ev as any));
    }

    useEffect(() => {
        // console.log('Button loaded');
        if (!el.current) return;
        el.current.addEventListener("click", handleClick);
        interceptFormSubmit(el.current);
        return () => el.current?.removeEventListener("click", handleClick);
    }, [el, onClick]);

    return (
        <button
            ref={el}
            className={
                `btn btn-sm ${(_loading || disabled) && "disabled"} ` +
                className
            }
            type={_type}
            {...props}
        >
            {children}
            {showLoader && _loading && (
                <span className="loading loading-spinner loading-sm"></span>
            )}
        </button>
    );
};

export default UButton;
