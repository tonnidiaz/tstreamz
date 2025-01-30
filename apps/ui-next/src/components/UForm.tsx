import { FormHTMLAttributes, useEffect, useRef } from "react";

interface IProps extends FormHTMLAttributes<{}> {
    state?: any;
}
const UForm = ({ children, onSubmit, ...props }: IProps) => {
    let formRef = useRef<HTMLFormElement>(null);
    const _onSubmit = async (e: any) => {
        console.log("TuForm: onSubmit");
        e.preventDefault();
        // console.log({e});
        // const btns = [...e.target.querySelectorAll("button[type=submit]")];
        // const btn: HTMLButtonElement = btns[0]
        // btn.onclick = async ()=> await onsubmit?.(e)
        // btn.classList.add('btn-loading')
        await onSubmit?.(e);
        // btn.classList.remove('btn-loading')
        // btns.forEach((btn: any) => (btn.disabled = false));
    };
    useEffect(() => {
        // console.log('TuForm mounted');
        // console.log(formRef, onsubmit);
        // formRef.addEventListener('submit', _onSubmit)
        if (formRef.current) formRef.current.onsubmit = _onSubmit;
        // return ()=> formRef.removeEventListener('submit', _onSubmit)
    }, [formRef.current]);
    return (
        <form method="POST" {...props} ref={formRef}>
            {children}
        </form>
    );
};

export default UForm;
