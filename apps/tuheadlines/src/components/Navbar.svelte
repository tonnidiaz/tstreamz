<script lang="ts">
    import { SITE } from "@/lib/constants";
    import TuLink from "@repo/ui/components/TuLink.svelte";
    import { onMount } from "svelte";
    import CtxMenu2 from "@repo/ui/components/CtxMenu2.svelte";
    import UAvatar from "@repo/ui/components/UAvatar.svelte";
    import UButton from "@repo/ui/components/UButton.svelte";
    import { page } from "$app/stores";
    import TuModal from "@repo/ui/components/TuModal.svelte";
    
 
    let menu: HTMLUListElement
            const onResize = () =>{
                const w = window.innerWidth
                const menuParent = document.getElementById("nav-menu")
                const ddMenu = document.getElementById("dropdown-menu")
                if (w <= 786){
                    if (menuParent?.contains(menu)){
                        menuParent.removeChild(menu)
                    ddMenu?.appendChild(menu)
                    }
                    
                }else{
                    // console.log(ddMenu.contains(menu));
                    if (ddMenu?.contains(menu)){
                      ddMenu.removeChild(menu)
                    menuParent?.appendChild(menu)  
                    }
                    
                }
            }
    onMount(() => {
        onResize()
        window.addEventListener("resize", onResize);
        return ()=> window.removeEventListener("resize", onResize)
    });

</script>

<div class="navbar !z-[51] bg-primary text-white">
    <div class="navbar-start">
        <div class="dropdown md:hidden">
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label tabindex="0" class="btn btn-ghost btn-circle">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
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
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <ul id="dropdown-menu"
                tabindex="0"
                class="menu menu-menu menu-sm text-left justify-start open border-1 border-card dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-md"
            >
            
                
            </ul>
        </div>
    </div>
    <div class="navbar-center">
        <a href="/" class="btn btn-ghost normal-case text-xl">{SITE}</a>
    </div>
    <div class="navbar-end">
        <div id="nav-menu">
           <ul class="menu menu-horizontal p-0 px-1 md:flex" bind:this={menu}>
            <li>
                <TuLink noactive to="/contact" class="">Contact us</TuLink>
            </li>
           
           
        </ul> 
        </div>
        
    </div>
</div>

