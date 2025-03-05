import TuDivider from "./TuDivider";

const TuCtxMenu = ({} : {}) => {
    return (
        <div>
            <div className="hs-dropdown [--trigger:contextmenu] relative z-20">
                <div className="hs-dropdown-toggle py-3 px-4 w-full h-[150px] flex justify-center items-center text-sm font-medium rounded-lg border-2 border-dashed border-blue-500 bg-white text-blue-600 shadow-sm dark:bg-neutral-800 dark:text-blue-500">
                    Right click
                </div>

                <div
                    className="hs-dropdown-menu hidden min-w-60 bg-white shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="hs-default"
                >
                    <div className="p-1 space-y-0.5 border-b border-gray-200 dark:border-neutral-800">
                        <button className="tu-ctx-menu-item">Profile</button>
                        <button className="tu-ctx-menu-item">Settings</button>
                    </div>
                    <div className="p-1 space-y-0.5 border-b border-gray-200 dark:border-neutral-800">
                        <div className="hs-dropdown [--placement:right-start] [--trigger:hover] relative">
                            <button
                                type="button"
                                className="hs-dropdown-toggle w-full flex items-center gap-x-3 py-1.5 px-3 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                role="menuitem"
                                tabIndex={-1}
                            >
                                <svg
                                    className="shrink-0 size-3.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="m10 8 4 4-4 4"></path>
                                </svg>
                                More
                                <svg
                                    className="shrink-0 size-3.5 ms-auto"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="m9 18 6-6-6-6"></path>
                                </svg>
                            </button>

                            <div
                                className="hs-dropdown-menu hidden min-w-60 bg-white shadow-md rounded-lg mt-2 before:w-4 before:absolute before:-start-4 before:top-0 before:h-full after:w-4 after:absolute after:-end-4 after:top-0 after:h-full dark:bg-neutral-800 dark:border dark:border-neutral-700"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="hs-default"
                            >
                                <div className="p-1 space-y-0.5 border-b border-gray-200 dark:border-neutral-800">
                                    <button
                                        type="button"
                                        className="w-full flex items-center gap-x-3 py-1.5 px-3 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                        data-hs-overlay="#hs-pro-chhsh"
                                    >
                                        <svg
                                            className="shrink-0 size-3.5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        >
                                            <path d="M20 7h-3a2 2 0 0 1-2-2V2"></path>
                                            <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"></path>
                                            <path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"></path>
                                        </svg>
                                        Link to conversation
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full flex items-center gap-x-3 py-1.5 px-3 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                        data-hs-overlay="#hs-pro-chhsh"
                                    >
                                        <svg
                                            className="shrink-0 size-3.5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        >
                                            <rect
                                                width="14"
                                                height="14"
                                                x="8"
                                                y="8"
                                                rx="2"
                                                ry="2"
                                            ></rect>
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                                        </svg>
                                        Copy conversation ID
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full flex items-center gap-x-3 py-1.5 px-3 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                        data-hs-overlay="#hs-pro-chhsh"
                                    >
                                        <svg
                                            className="shrink-0 size-3.5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        >
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                        </svg>
                                        Copy conversation link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-1 space-y-0.5">
                        <button
                            type="button"
                            className="w-full flex items-center gap-x-3 py-1.5 px-3 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                            <svg
                                className="shrink-0 size-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <rect
                                    width="20"
                                    height="16"
                                    x="2"
                                    y="4"
                                    rx="2"
                                ></rect>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </svg>
                            Mark as unread
                        </button>
                        <button
                            type="button"
                            className="w-full flex items-center gap-x-3 py-1.5 px-3 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                            <svg
                                className="shrink-0 size-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"></path>
                                <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"></path>
                            </svg>
                            Mark as read
                        </button>
                        <button
                            type="button"
                            className="w-full flex items-center gap-x-3 py-1.5 px-3 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                            <svg
                                className="shrink-0 size-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <rect
                                    width="20"
                                    height="5"
                                    x="2"
                                    y="3"
                                    rx="1"
                                ></rect>
                                <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
                                <path d="M10 12h4"></path>
                            </svg>
                            Archive
                        </button>
                        <button
                            type="button"
                            className="w-full flex items-center gap-x-3 py-1.5 px-3 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                            <svg
                                className="shrink-0 size-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                <line x1="14" x2="14" y1="11" y2="17"></line>
                            </svg>
                            Delete
                        </button>
                        <button
                            type="button"
                            className="w-full flex items-center gap-x-3 py-1.5 px-3 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                            <svg
                                className="shrink-0 size-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M12 16h.01"></path>
                                <path d="M12 8v4"></path>
                                <path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z"></path>
                            </svg>
                            Report spam
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TuCtxMenu;
