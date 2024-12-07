<script lang="ts">
    import { SITE } from "@/lib/constants";
    import { userStore } from "@/stores/user.svelte";
    import TuLink from "@repo/ui/components/TuLink.svelte";
    import { onMount } from "svelte";
    import MenuItem from "./MenuItem.svelte";
    import UDivider from "@repo/ui/components/UDivider.svelte";
    import CtxMenu2 from "@repo/ui/components/CtxMenu2.svelte";
    import UAvatar from "@repo/ui/components/UAvatar.svelte";
    import UButton from "@repo/ui/components/UButton.svelte";
    import Genres from "./Genres.svelte";
    
    let ioConnected = $state(true);
    let menuOpen = $state(false);
    let { user } = $derived(userStore);
    let menu: HTMLUListElement
    const menuItems = [
        [
            {
                label: "Profile",
                icon: "i-heroicons-user-circle-20-solid",
            },
        ],
    ];
            const onResize = () =>{
                const w = window.innerWidth
                const menuParent = document.getElementById("nav-menu")
                const ddMenu = document.getElementById("dropdown-menu")
                if (w <= 786){
                    if (menuParent.contains(menu)){
                        menuParent.removeChild(menu)
                    ddMenu.appendChild(menu)
                    }
                    
                }else{
                    // console.log(ddMenu.contains(menu));
                    if (ddMenu.contains(menu)){
                      ddMenu.removeChild(menu)
                    menuParent.appendChild(menu)  
                    }
                    
                }
            }
    onMount(() => {
        onResize()
        window.addEventListener("resize", onResize);
        return ()=> window.removeEventListener("resize", onResize)
    });

</script>

<div class="navbar !z-[51]">
    <div class="navbar-start">
        <div class="dropdown">
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
                <li><TuLink to="/">Home</TuLink></li>
                
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
                <TuLink to="/movies">Movies</TuLink>
            </li>
            <li>
                <TuLink to="/tv">Shows</TuLink>
            </li>
            <li>
                <CtxMenu2 anchor="top" class="pd-0">
                    {#snippet toggler()}
                        Genre
                    {/snippet}
                    <Genres />
                </CtxMenu2>
            </li>
        </ul> 
        </div>
        

    

        {#if user}
            <div class="relative">
                <!-- <div class="avatar ring rounded-full"></div> -->
                <CtxMenu2 class="relative mr-4">
                    {#snippet toggler()}
                        <UAvatar class="pointer ring-neutral"
                        
                            ><span class="text-md fw-7"
                                >{user.username.slice(0, 1).toUpperCase()}</span
                            ></UAvatar
                        >
                    {/snippet}
                    <ul>
                        <MenuItem
                        to="/me/profile"
                        icon="fi fi-br-circle-user"
                        >Profile</MenuItem
                    >
                    <MenuItem
                        to={`/me/watchlist`}
                        icon="fi fi-br-bookmark">Watchlist</MenuItem
                    >
                    <MenuItem
                        to={`/account`}
                        icon="fi fi-br-user-robot-xmarks">Account</MenuItem
                    >
                    <MenuItem to={`/auth/logout`} icon="fi fi-br-sign-out-alt"
                        >Logout</MenuItem
                    >
                    </ul>
                    
                </CtxMenu2>
            </div>
        {:else}
            <div>
                <UButton>
                    <TuLink
                        to={`/auth/login?red=${location.pathname}`}
                        class="btn btn-sm btn-outline btn-primary"
                    >
                        Login
                    </TuLink></UButton
                >
            </div>
        {/if}
    </div>
</div>

<style>
    
</style>
