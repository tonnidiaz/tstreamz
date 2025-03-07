import { HTMLAttributes } from "react";

const TuMiniSidebar = ({
    children,
    className = "",
}: HTMLAttributes<{}> & {}) => {
    return (
        <div
            id="hs-sidebar-mini-sidebar"
            className={
                "hs-overlay [--auto-close:lg] lg:block w-50px lg:translate-x-0 lg:end-autow-20 hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform h-full start-0 bottom-0 z-20 bg-white border-e border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 " +
                className
            }
            role="dialog"
            tabIndex={-1}
            aria-label="Sidebar"
        >
            <div className="relative flex flex-col h-full max-h-full items-center gap-2">
                {children}
            </div>
        </div>
    );
};

export default TuMiniSidebar;
