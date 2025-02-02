import { HTMLAttributes } from "react";

const UDivider = ({ className, ...props }: HTMLAttributes<any>) => {
    return (
        <div
            className={"tu-divider" + className}
            {...props}
        ></div>
    );
};

export default UDivider;
 