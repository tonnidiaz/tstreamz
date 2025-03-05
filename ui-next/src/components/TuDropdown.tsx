import { HTMLAttributes, ReactNode } from "react";

const TuDropdown = ({trigger, children, className = "", isSubmenu} : HTMLAttributes<{}> & {trigger?: ReactNode; isSubmenu?: boolean}) => {
    return (
        <div className={"hs-dropdown relative inline-flex " + className + (isSubmenu && " [--placement:right-start]")}>
            <div
                className="hs-dropdown-toggle w-full"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="Dropdown"
            >{trigger}</div>

            <div
                className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700"
                role="menu"
                aria-orientation="vertical"
            >
                <div className="p-1 space-y-0.5">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default TuDropdown;
