import { TextareaHTMLAttributes } from "react";
import { useTuState } from "../lib/hooks";

interface IProps extends TextareaHTMLAttributes<{}> {
    value?: any;
}

const UTextArea = ({ value = useTuState(), className, ...props }: IProps) => {
    return (
        <textarea
            value={value.value}
            onChange={({ target }) => (value.value = target.value)}
            style={{ resize: "both" }}
            className={"textarea textarea-bordered " + className}
            {...props}
        ></textarea>
    );
};

export default UTextArea;
