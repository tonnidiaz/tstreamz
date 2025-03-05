import { LabelHTMLAttributes, ReactNode } from "react";

const TuFormGroup = ({ children, className = "", label, ...props }: LabelHTMLAttributes<{}> & {label?: ReactNode}) => {
    return (
            <label {...props} className={"mb-1 " + className}>
                <span className="block mb-2 ml-2 text-sm font-medium w-full">{label}</span>
                <div>{children}</div>
            </label>
    );
};

export default TuFormGroup;
