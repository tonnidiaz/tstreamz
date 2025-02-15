import { TextareaHTMLAttributes } from "react";
import { useTuState0 } from "../lib/hooks";

interface IProps extends TextareaHTMLAttributes<{}> {
}

const UTextArea = ({ className, ...props }: IProps) => {
    return (
        <textarea
            style={{ resize: "both" }}
            className={"textarea textarea-bordered " + className}
            {...props}
        ></textarea>
    );
};

export default UTextArea;
