import { FormHTMLAttributes, useEffect, useRef } from "react";

interface IProps extends FormHTMLAttributes<{}> {
    state?: any;
}
const UForm = ({ children, onSubmit, ...props }: IProps) => {
    let formRef = useRef<HTMLFormElement>(null);
    const handleSubmit = async (e: any) => {
        console.log("TuForm: onSubmit");
        e.preventDefault();
        await onSubmit?.(e);
    };
    useEffect(() => {
        if (formRef.current) formRef.current.onsubmit = handleSubmit;
    }, [onSubmit]);
    return (
        <form method="POST" {...props} ref={formRef}>
            {children}
        </form>
    );
};

export default UForm;
