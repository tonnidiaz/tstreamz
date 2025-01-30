import { HTMLAttributes } from "react";

const UDivider = ({ className, ...props }: HTMLAttributes<any>) => {
    return (
        <div
            className={"devider border-1 border-card w-100 " + className}
            {...props}
        ></div>
    );
};

export default UDivider;
