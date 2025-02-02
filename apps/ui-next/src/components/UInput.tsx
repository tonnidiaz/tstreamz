import { InputHTMLAttributes, ReactNode } from "react";
import { TuState } from "../lib/interfaces";

export interface IUInputProps extends InputHTMLAttributes<any> {
    override?: string;
    inputClass?: string;
    trailing?: ReactNode;
    leading?: ReactNode;
    $value?: TuState<any>;
}
const UInput = ({
    disabled,
    inputClass,
    leading,
    trailing,
    className,
    override,
    onChange,
    value,
    $value,
    ...props
}: IUInputProps) => {
    const defClass =
        override && override.split(" ").find((el) => el == "class")
            ? ""
            : "flex gap-3 items-center input input-bordered input-sm ";

    return (
        <div
            className={`${defClass + className || ""} ${disabled && "disabled"}`}
        >
            {leading}
            <input
                {...props}
                value={!$value ? value : $value.value}
                className={inputClass || ""}
                disabled={disabled}
                onChange={
                    !$value
                        ? onChange
                        : ({ target }) => {
                              $value.value = target.value;
                          }
                }
            />
            {trailing}
        </div>
    );
};

export default UInput;
