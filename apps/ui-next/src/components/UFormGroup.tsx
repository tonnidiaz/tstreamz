import { IObj } from "@cmn/utils/interfaces";
import { LabelHTMLAttributes, ReactNode } from "react";

 interface IProps extends LabelHTMLAttributes<{}> {
        label?: ReactNode | string;
        labelClass?: string;
        labelStyle?: IObj;
    }

const UFormGroup = ({
        label,
        labelClass = "",
        children,
        className,
        labelStyle,
        ...props
    }: IProps ) => {
    return ( <label className={"label block " + className} {...props}>
    <div className={`mb-1 ml-1 ${labelClass}`} style={labelStyle}>
        {label}
    </div>
    {children}
</label> );
}
 
export default UFormGroup;