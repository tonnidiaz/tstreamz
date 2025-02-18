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
    type: _type = "button",
    disabled,
    onClick,
    ...props
}: IProps) => {
    const el = useRef<HTMLButtonElement>(null);
    const [_loading, setLoading] = useState(loading || className?.includes("btn-loading"))



    async function caller(cb: Function) {
        try {
            setLoading(true);
            el.current.classList.add("disabled")//.disabled = true;
            await cb?.();
        } catch (err) {
            console.log("[UButton] caller() error", err);
            handleErrs(err);
        } finally {
            if (!el) return;
            el.current.classList.remove("disabled")//.disabled = false;
            setLoading(false);
        }
    }
    async function handleClick(this: HTMLButtonElement, ev: MouseEvent) {
        ev.preventDefault()
        if (_type == 'submit'){const e = new Event("submit", {bubbles: true, cancelable: true})
        await caller(async () => await this.form?.onsubmit?.call(this.form, e as SubmitEvent));}
    else{await caller(onClick)}
        
    }

    useEffect(() => {
        if (!el.current) return;
        el.current?.removeEventListener("click", handleClick)
        el.current.addEventListener("click", handleClick);
        return () => el.current?.removeEventListener("click", handleClick);
    }, [onClick]);
    
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
