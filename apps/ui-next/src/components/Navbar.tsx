import { HTMLAttributes, ReactNode, useEffect, useRef } from "react";
import CtxMenu2 from "./CtxMenu2";
import MenuItem from "./MenuItem";
import TuLink from "./TuLink";
import UAvatar from "./UAvatar";
import UButton from "./UButton";
import { type IObj } from "@cmn/utils/interfaces";
import { TState } from "../lib/interfaces";

interface IProps extends HTMLAttributes<any> {
    site: string;
    /**The horizontal menu items(li TuLink) on the navbar*/
    menuItems?: ReactNode;
    user?: TState<IObj>;
    ready: TState<boolean>;
    hasLogin?: boolean;
    /**The menu-items (MenuItem) on the user avatar dropdown menu. */
    userMenuItems?: ReactNode;
}
const Navbar = ({
    site,
    menuItems,
    hasLogin,
    user,
    ready,
    userMenuItems,
    className,
    ...props
}: IProps) => {
    const menuRef = useRef<HTMLUListElement>(null);
    const onResize = () => {
        const menu = menuRef.current;
        const w = window.innerWidth;
        const menuParent = document.getElementById("nav-menu");
        const ddMenu = document.getElementById("dropdown-menu");
        if (w <= 786) {
            if (menuParent.contains(menu)) {
                menuParent.removeChild(menu);
                ddMenu.appendChild(menu);
            }
        } else {
            // console.log(ddMenu.contains(menu));
            if (ddMenu.contains(menu)) {
                ddMenu.removeChild(menu);
                menuParent.appendChild(menu);
            }
        }
    };
    useEffect(() => {
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);
    return (
        <div className={`navbar !z-[51] ${className}`} {...props}>
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h7"
                            />
                        </svg>
                    </label>
                    <ul
                        id="dropdown-menu"
                        tabIndex={0}
                        className="menu menu-menu menu-sm text-left justify-start open border-1 border-card dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-md"
                    ></ul>
                </div>
            </div>
            <div className="navbar-center">
                <a href="/" className="btn btn-ghost normal-case text-xl">
                    {site}
                </a>
            </div>
            <div className="navbar-end">
                <div id="nav-menu">
                    <ul
                        className="menu menu-horizontal p-0 px-1 md:flex"
                        ref={menuRef}
                    >
                        {menuItems}
                    </ul>
                </div>
                {hasLogin && user.value ? (
                    <div className="relative">
                        <CtxMenu2
                            className="relative mr-4"
                            toggler={
                                <UAvatar
                                    className={`pointer ring-${user.value.is_admin ? "success" : "neutral"}`}
                                >
                                    <span className="text-md fw-7">
                                        {user.value.username
                                            .slice(0, 1)
                                            .toUpperCase()}
                                    </span>
                                </UAvatar>
                            }
                        >
                            <ul>
                                {userMenuItems}
                                {user.value.is_admin && (
                                    <MenuItem
                                        reload
                                        to="/admin/contact"
                                        icon="fi fi-br-envelope"
                                    >
                                        Admin:contact
                                    </MenuItem>
                                )}

                                <MenuItem
                                    to={`/auth/logout`}
                                    icon="fi fi-br-sign-out-alt"
                                >
                                    Logout
                                </MenuItem>
                            </ul>
                        </CtxMenu2>
                    </div>
                ) : (
                    <div>
                        <UButton
                            loading={!ready}
                            className="btn-sm btn-outline btn-primary"
                        >
                            {ready && (
                                <TuLink
                                    reload
                                    to={`/auth/login?red=${location.pathname.includes("auth") ? "/" : location.href.replace(location.origin, "")}`}
                                >
                                    Login
                                </TuLink>
                            )}
                        </UButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
