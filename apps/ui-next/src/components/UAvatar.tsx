import { HTMLAttributes } from "react";

interface IProps extends HTMLAttributes<any> {
    online?: boolean;
    innerclass?: string;
}
const UAvatar = ({ online, children, className, ...props }: IProps) => {
    return (
        <div
            className={`avatar ring rounded-full w-25px h-25px flex items-center justify-center ring-offset-base-100 ring-offset-2 ${online != undefined ? (online ? "online" : "offline") : ""} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default UAvatar;
