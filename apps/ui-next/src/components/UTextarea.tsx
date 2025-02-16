import { TextareaHTMLAttributes } from "react";
import { useTuState0 } from "../lib/hooks";

interface IProps extends TextareaHTMLAttributes<{}> {
    onChange?: (val: any)=>PromiseLike<any>
}

const UTextArea = ({ className, onChange, ...props }: IProps) => {
    return (
        <textarea
            style={{ resize: "both" }}
            onChange={({target})=>onChange?.(target.value)}
            className={"textarea textarea-bordered " + className}
            {...props}
        ></textarea>
    );
};

export default UTextArea;
