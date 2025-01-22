<script lang="ts">
    import { page } from "$app/stores";
    import { onMount, type Snippet } from "svelte";
    import CtxMenu2 from "./CtxMenu2.svelte";
    import MenuItem from "./MenuItem.svelte";
    import TuLink from "./TuLink.svelte";
    import UAvatar from "./UAvatar.svelte";
    import UButton from "./UButton.svelte";
    import { type IObj } from "@cmn/utils/interfaces";

    interface IProps {
        site: string;
        menuItems?: Snippet;
        user?: IObj;
        ready: boolean;
        /**The menu-items (MenuItem) on the user avatar dropdown menu. */
        userMenuItems?: Snippet;
    }

    let {
        site,
        menuItems,
        user = $bindable(),
        ready = $bindable(),
        userMenuItems,
    }: IProps = $props();

    let menu: HTMLUListElement;
    const onResize = () => {
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
    onMount(() => {
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
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
            <ul
                id="dropdown-menu"
                tabindex="0"
                class="menu menu-menu menu-sm text-left justify-start open border-1 border-card dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-md"
            >
                <li><TuLink to="/">Home</TuLink></li>
            </ul>
        </div>
    </div>
    <div class="navbar-center">
        <a href="/" class="btn btn-ghost normal-case text-xl">{site}</a>
    </div>
    <div class="navbar-end">
        <div id="nav-menu">
            <ul class="menu menu-horizontal p-0 px-1 md:flex" bind:this={menu}>
                {@render menuItems?.()}
            </ul>
        </div>

        {#if user}
            <div class="relative">
                <!-- <div class="avatar ring rounded-full"></div> -->
                <CtxMenu2 class="relative mr-4">
                    {#snippet toggler()}
                        <UAvatar
                            class={`pointer ring-${user.is_admin ? "success" : "neutral"}`}
                            ><span class="text-md fw-7"
                                >{user.username.slice(0, 1).toUpperCase()}</span
                            ></UAvatar
                        >
                    {/snippet}
                    <ul>
                        {@render userMenuItems?.()}
                        {#if user.is_admin}
                            <MenuItem
                                reload
                                to="/admin/contact"
                                icon="fi fi-br-envelope">Admin:contact</MenuItem
                            >
                        {/if}

                        <MenuItem
                            to={`/auth/logout`}
                            icon="fi fi-br-sign-out-alt">Logout</MenuItem
                        >
                    </ul>
                </CtxMenu2>
            </div>
        {:else}
            <div>
                <UButton loading={!ready} class="btn-sm btn-outline btn-primary">
                    {#if ready}
                        <TuLink
                            reload
                            to={`/auth/login?red=${$page.url.pathname.includes("auth") ? "/" : $page.url.href.replace($page.url.origin, "")}`}
                            
                        >
                            Login
                        </TuLink>
                    {/if}
                </UButton>
            </div>
        {/if}
    </div>
</div>
