import { DetailsHTMLAttributes } from "react";

interface IProps extends Omit<DetailsHTMLAttributes<{}>, "content"> {
    label?: React.ReactNode;
    multiple?: boolean;
}
const UAccordion = ({
    label,
    children,
    className,
    multiple,
    ...props
}: IProps) => {
    return (
        <details
            className={
                "collapse collapse-arrow border border-card  collapse-sm hdn " +
                className
            }
            {...props}
        >
            <summary className="collapse-title text-l font-medium w-full">
                {label}
            </summary>
            <div className="collapse-content w-full">{children}</div>
        </details>
    );
};

export default UAccordion;
