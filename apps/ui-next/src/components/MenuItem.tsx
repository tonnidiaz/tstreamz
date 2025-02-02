import { HTMLAttributes, useEffect, useRef } from "react";
import { TuState } from "../lib/interfaces";
import TuLink from "./TuLink";

interface IProps extends HTMLAttributes<any> {
    to?: string;
    title?: string;
    innerClass?: string;
    icon?: string;
    reload?: boolean;
    loading?: TuState<boolean>;
    disabled?: boolean;
}
const MenuItem = ({
    to,
    innerClass,
    children,
    title,
    icon,
    reload,
    className,
    onClick,
    loading,
    disabled,
    ...props
}: IProps) => {

    const ref = useRef<HTMLLIElement>(null)
    useEffect(()=>{
        ref.current.onclick = async (e) => {
            loading.value = true;
            try {
                await onClick(e as any);
            } catch (err) {
                console.log(err);
            } finally {
                loading.value = false;
            }
        };
    }, [onClick])
    const Child = () => (
        <>
            {icon && <i className={icon}></i>}
            <div className="flex-1">{children}</div>
            {loading.value && (
                <span className="loading loading-sm loading-ring"></span>
            )}
        </>
    );
    return (
        <li
            ref={ref}
            className={
                `tooltip tooltip-right tu-menu-item ${(loading.value || disabled) && "disabled"} ` +
                className
            }
            data-tip={title}
            {...props}
        >
            {to ? (
                <TuLink
                    reload={reload}
                    to={to}
                    className={`flex items-center gap-2 ${innerClass}`}
                >
                    <Child />
                </TuLink>
            ) : (
                <span className={`flex items-center gap-2 ${innerClass}`}>
                    <Child />
                </span>
            )}
        </li>
    );
};

export default MenuItem;
