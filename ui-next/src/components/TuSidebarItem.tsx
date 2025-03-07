import { ReactNode } from "react";
import {Link} from 'react-router'
const TuSidebarItem = ({icon, label, to} : {icon: ReactNode; label?: string; to?: string}) => {
    return (
        <div className="hs-tooltip [--placement:right] inline-block">
            <Link
                className="hs-tooltip-toggle w-40px h-40px inline-flex justify-center items-center gap-x-2 fs-20 font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                to={to}
            >
                {icon}
                <span
                    className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap dark:bg-neutral-900"
                    role="tooltip"
                >
                    {label}
                </span>
            </Link>
        </div>
    );
};

export default TuSidebarItem;
