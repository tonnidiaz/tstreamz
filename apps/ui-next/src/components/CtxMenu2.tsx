import { HTMLAttributes, useEffect, useRef } from "react";
import TuTeleport from "./TuTeleport";
import { TuState } from "../lib/interfaces";
import { useTuState0 } from "../lib/hooks";


interface IProps extends HTMLAttributes<any> {
    toggler?: React.ReactNode;
    open?: TuState<boolean>;
    anchor?: "top" | "bottom";
}
const CtxMenu2 = ({
    children,
    toggler: trigger,
    open = useTuState0(false),
     className,
    anchor,
    ...props
}: IProps) => {

    const menuRef = useRef<HTMLDivElement | null>(null);
    const menuContent = useRef<HTMLDivElement | null>(null);
    const togglerRef = useRef<HTMLDivElement | null >(null);

    const pos = useTuState0({ x: 0, y: 0 });

    const otherClasses =
        "menu menu-menu menu-sm text-left justify-start shadow";

    const toggleMenu = (e: any) => {
        e.preventDefault();
        updatePos({});
        open.value = true;
        updateListener();
    };

    const updateListener = () => {
        document.body.removeEventListener("mouseup", onDocClick);
        document.body.addEventListener("mouseup", onDocClick);
    };

    const onDocClick = (e: any) => {
        const _menu = menuRef.current;

        if (_menu && !_menu.contains(e.target)) {
            open.value = false;
        }
    };

    const updatePos = ({ xOut, yOut }: { xOut?: boolean; yOut?: boolean }) => {
        const winSz = { w: window.innerWidth, h: window.innerHeight };
        // Get position and size of toggler
        const togglerRect = togglerRef.current.getBoundingClientRect();
        let xInPerc = togglerRect.left + togglerRect.width / 2; // togglerRect.left / winSz.w * 100;
        xInPerc = (xInPerc / winSz.w) * 100;
        let yInPerc = togglerRect.top + togglerRect.height / 2;
        yInPerc = (yInPerc / winSz.h) * 100;

        // Update menu position
        pos.value = { x: xInPerc, y: yInPerc };
    };


    useEffect(()=>{
        const _menuRef = menuRef.current
        if (_menuRef){
            const winSz = { w: window.innerWidth, h: window.innerHeight };
            const menuRect = _menuRef.getBoundingClientRect();

            const menuRightInPerc = (menuRect.right / winSz.w) * 100;
            const menuBottomInPerc = (menuRect.bottom / winSz.h) * 100;
            const xOut = menuRightInPerc > 100;
            const yOut = menuBottomInPerc > 100;
            // console.log({yOut, menuBottomInPerc, menuRect});
            if (xOut || yOut) {
                _menuRef.style.transform = `translate(${xOut ? -100 : 0}%, ${yOut ? -100 : 0}%)`;
            }
        }
    }, [menuRef])

    useEffect(() => {
        // Intercept all menu-items onclicks
        if (menuRef.current){
            const menuItems = menuRef.current.querySelectorAll(".tu-menu-item") as NodeListOf<HTMLLIElement>;
            menuItems.forEach(it=>{
                const oldOnclick = it.onclick;
                it.onclick = async(e)=>{
                    const  r = !oldOnclick ? true : await oldOnclick.call(e)
                        if (r) open.value = false
                }
                
            })
        }
    }, [menuRef]);
    return ( <div>
        <div className="hidden" ref={menuContent}>{children}</div>
        <div ref={togglerRef} className="menu-trigger w-fit" onClick={toggleMenu}>
            {trigger}
        </div>
        { open.value &&
            <TuTeleport to="#ctx-overlay">
                <div
                    style={{left: `${pos.value.x}%`, top: `${pos.value.y}%`}}
                    ref={menuRef}
                    className={`ctx-menu fixed menu border-1 border-card rounded-md p-2 bg-base-200 z-[60] ${otherClasses} ` +
                        className}
                    {...props}
                >
                    {children}
                </div>
             </TuTeleport>
        }
    </div>
     );
}
 
export default CtxMenu2;
