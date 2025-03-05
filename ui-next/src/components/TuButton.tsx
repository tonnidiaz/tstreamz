import { handleErrs } from "@cmn/utils/funcs";
import { ButtonHTMLAttributes, useEffect, useMemo, useRef, useState } from "react";

const TuButton = ({
    variant = "default",
    children,
    className,
    loading,
    disabled,
    showLoader,
    onClick,
    type: _type = "button",
    ...props
}: ButtonHTMLAttributes<{}> & {
    loading?: boolean;
    showLoader?: boolean;
    variant?:
        | "default"
        | "alternative"
        | "dark"
        | "dark"
        | "light"
        | "success"
        | "error"
        | "warning"
        | "secondary";
}) => {
    const _class = useMemo(() => {
        let val = "";
        switch (variant) {
            case "default":
                val =
                    "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800";
                break;
            case "alternative":
                val =
                    "py-2.5 px-5 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700";
                break;
            case "dark":
                val =
                    "text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700";
                break;
            case "light":
                val =
                    "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700";
                break;
            case "success":
                val =
                    "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800";
                break;
            case "error":
                val =
                    "focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900";
                break;
            case "warning":
                val =
                    "focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:focus:ring-yellow-900";
                break;
            case "secondary":
                val =
                    "focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900";
                break;
        }

        return val;
    }, [variant]);

    const el = useRef<HTMLButtonElement>(null);
    const [_loading, setLoading] = useState(
        loading || className?.includes("btn-loading")
    );

    async function caller(cb: Function) {
        try {
            setLoading(true);
            el.current.classList.add("disabled"); //.disabled = true;
            await cb?.();
        } catch (err) {
            console.log("[UButton] caller() error", err);
            handleErrs(err);
        } finally {
            if (!el) return;
            el.current.classList.remove("disabled"); //.disabled = false;
            setLoading(false);
        }
    }
    async function handleClick(this: HTMLButtonElement, ev: MouseEvent) {
        ev.preventDefault();
        if (_type == "submit") {
            if (!this.form.reportValidity()) return;
            const e = new Event("submit", { bubbles: true, cancelable: true });
            const eventPromise = new Promise((resolve) => {
                this.form.addEventListener("submit", resolve, { once: true });
            });

            this.form.dispatchEvent(e);
            await caller(async () => await eventPromise);
        } else {
            await caller(onClick);
        }
    }

    useEffect(() => {
        if (!el.current) return;
        el.current?.removeEventListener("click", handleClick);
        el.current.addEventListener("click", handleClick);
        console.log({onClick});
        return () => el.current?.removeEventListener("click", handleClick);
    }, [onClick]);

    useEffect(()=>{
        console.log({_loading, showLoader});
    }, [_loading])

    return (
        <button type={_type} className={`${_class} ${(_loading || disabled) && "disabled"} ${className}`} {...props}>
            {children}
            {showLoader && _loading && (
                <span className="loading loading-spinner loading-sm"></span>
            )}
        </button>
    );
};

export default TuButton;
