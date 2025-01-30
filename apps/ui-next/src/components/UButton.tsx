import { ButtonHTMLAttributes, HTMLAttributes, useEffect, useRef } from "react";
import { withBind } from "../lib/tsx/tu";
import { handleErrs } from "@cmn/utils/funcs";

{
    /* <script lang="ts">
    import { handleErrs } from "@cmn/utils/funcs";
    import { onMount } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";

    interface IProps extends HTMLButtonAttributes {
        loading?: boolean;
        showLoader?: boolean;
    }
    let {
        children,
        class: className,
        loading = $bindable(),
        type: _type = "button",
        showLoader = true,
        onClick,
        ...props
    }: IProps = $props();
    let el = $state<HTMLButtonElement>();
    onMount(() => {
        el.addEventListener("click", handleClick);
        interceptFormSubmit(el);
        return () => el.removeEventListener("click", handleClick);
    });

    let submitHandler = $state<Function>();

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
                    e.preventDefault()
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
            loading = true;
            el.disabled = true;
            await cb();
        } catch (err) {
            handleErrs(err);
        } finally {
            // console.log('Finally');
            if (!el) return;
            el.disabled = false;
            loading = false;
        }
    }
    async function handleClick(this: HTMLButtonElement, ev: MouseEvent) {
        await caller(async () => await onClick?.(ev as any));
    }
</script> */
}
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
    onClick,
    ...props
}: IProps) => {

    const el = useRef<HTMLButtonElement>(null)
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
                    e.preventDefault()
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
            loading = true;
            el.current.disabled = true;
            await cb();
        } catch (err) {
            console.log('[UButton] caller() error', err);
            handleErrs(err);
        } finally {
            // console.log('Finally');
            if (!el) return;
            el.current.disabled = false;
            loading = false;
        }
    }
    async function handleClick(this: HTMLButtonElement, ev: MouseEvent) {
        await caller(async () => await onClick?.(ev as any));
    }

    useEffect(()=>{
        console.log('Button loaded');
        if (!el.current) return
        el.current.addEventListener("click", handleClick);
        interceptFormSubmit(el.current);
        return () => el.current?.removeEventListener("click", handleClick);
    }, [el])

    return (
        <button
            ref={el}
            className={`btn btn-sm ` + className}
            type={_type}
            {...props}
        >
            {children}
            {showLoader && (loading || className?.includes("btn-loading")) && (
                <span className="loading loading-spinner loading-sm"></span>
            )}
        </button>
    );
};

export default UButton;
