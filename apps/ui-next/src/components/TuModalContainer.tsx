import { HTMLAttributes, useEffect, useMemo, useRef } from "react";
import { TuState } from "../lib/interfaces";
import { useTuState0 } from "../lib/hooks";
import { useParams, usePathname } from "next/navigation";

interface IProps extends HTMLAttributes<any> {
    open: TuState<boolean>;
    // setOpen: (v: boolean)=> any;
    blank?: boolean;
}

const TuModalContainer = ({
    open,
    // setOpen,
    children,
    blank = false,
    className,
    ...props
}: IProps) => {
    let modalRef = useRef<HTMLDivElement>(null);
    const _onDocClick = (ev) => {
        const modal = modalRef.current;
        const overlay = document.getElementById("ctx-overlay");
        if (!modal) return;
        const isChild =
            modal.contains(ev.target) || overlay?.contains(ev.target);
        if (!isChild) {
            // setOpen(false);
            open.value = false
            //$(modal!).removeClass("open");
        }
    };
    const _onOverlayClick = (ev: any) => {
        const modals = document.querySelectorAll(".tu-modal__cont");
        const menus = document.querySelectorAll(".menu");

        const isChild =
            [...modals].some((el) => el.contains(ev.target)) ||
            [...menus].some((el) => el.contains(ev.target));
        if (!isChild) open.value =  false//setOpen(false);
    };
    useEffect(() => {
        // document.removeEventListener("mouseup", _onDocClick);
        // document.addEventListener("mouseup", _onDocClick);
        const ctxOverlay = document.getElementById("ctx-overlay");
        ctxOverlay?.removeEventListener("mouseup", _onOverlayClick);
        ctxOverlay?.addEventListener("mouseup", _onOverlayClick);
        return () => {
            const ctxOverlay = document.getElementById("ctx-overlay");
            ctxOverlay?.removeEventListener("mouseup", _onOverlayClick);
        };
    }, []);

    const pathname = usePathname()
    const params = useParams()

    useEffect(() => {
        // watch route
        // setOpen(false);
    }, [pathname, params]);
    return (
        <div
            ref={modalRef}
            className={`tu-modal__cont ${!blank ? "tu-modal-cont p-4 border-1 border-card br-10 params-area bg-base-100 shadow-lg" : ""} ${
                open ? "open" : ""
            } ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default TuModalContainer;
