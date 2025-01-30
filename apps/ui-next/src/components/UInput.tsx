import { InputHTMLAttributes, ReactNode } from "react";

export interface IUInputProps extends InputHTMLAttributes<any> {
    override?: string;
    inputClass?: string;
    trailing?: ReactNode;
    leading?: ReactNode;
}
const UInput = ({value, disabled, inputClass,leading, trailing, className,override,...props}: IUInputProps) => {
    const defClass = override && override.split(" ").find((el) => el == "class")
        ? ""
        : "flex gap-3 items-center input input-bordered input-sm ";
    return ( <div className={`${defClass + className || ''} ${disabled && 'disabled'}`}>
        {leading}
        <input value={value} {...props} className={inputClass || ''} disabled={disabled} />
        {trailing}
    </div>
  
     );
}
 
export default UInput;