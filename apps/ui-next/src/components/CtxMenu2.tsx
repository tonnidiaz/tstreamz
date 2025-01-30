import { HTMLAttributes, useEffect, useRef } from "react";
import { $gstate } from "../lib/tu";
import TuTeleport from "./TuTeleport";

{/* <script lang="ts">
    import { onMount, untrack, type Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";
    import TuTeleport from "./TuTeleport.svelte";
    import { page } from "$app/stores";

    
    let  = $props();

    
    onMount(() => {});

    $effect(() => {
        if (menuRef) {
           
        }
    });

    let p = $derived($page.url.href);
    $effect(() => {
        // watch route
        p;
        untrack(() => {
            open = false;
        });
    });

    
</script> */}

interface IProps extends HTMLAttributes<any> {
    toggler?: React.ReactNode;
    open?: boolean;
    anchor?: "top" | "bottom";
}
const CtxMenu2 = ({
    children,
    toggler: trigger,
    open,
     className,
    anchor,
    ...props
}: IProps) => {

    let menuRef = useRef<HTMLDivElement | null>(null);
    let menuContent = useRef<HTMLDivElement | null>(null);
    let togglerRef = useRef<HTMLDivElement | null >(null);

    let pos = $gstate({ x: 0, y: 0 });
    let _open = $gstate({value: open})

    const otherClasses =
        "menu menu-menu menu-sm text-left justify-start shadow";

    const toggleMenu = (e: any) => {
        console.log('Toggle');
        e.preventDefault();
        updatePos({});
        _open.value = true;
        updateListener();
    };

    const updateListener = () => {
        document.body.removeEventListener("mouseup", onDocClick);
        document.body.addEventListener("mouseup", onDocClick);
    };

    const onDocClick = (e: any) => {
        const _menu = menuRef.current;

        if (_menu && !_menu.contains(e.target)) {
            _open.value = false;
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
        pos = { x: xInPerc, y: yInPerc };
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
                        if (r) _open.value = false
                }
                
            })
        }
    }, [menuRef]);
    return ( <div>
        <div className="hidden" ref={menuContent}>{children}</div>
        <div ref={togglerRef} className="menu-trigger w-fit" onClick={toggleMenu}>
            {trigger}
        </div>
        {_open.value &&
            <TuTeleport to="#ctx-overlay">
                <div
                    style={{left: `${pos.x}%`, top: `${pos.y}%`}}
                    ref={menuRef}
                    className={`ctx-menu menu border-1 border-card rounded-md p-2 bg-base-200 z-[60] ${otherClasses} ` +
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
