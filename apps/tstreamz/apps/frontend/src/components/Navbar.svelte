<script lang="ts">
    import { SITE } from "@/lib/constants";
    import { userStore } from "@/stores/user.svelte";
    import TuLink from "@repo/ui-sv/components/TuLink.svelte";
    import { onMount } from "svelte";
    import CtxMenu2 from "@repo/ui-sv/components/CtxMenu2.svelte";
    import UAvatar from "@repo/ui-sv/components/UAvatar.svelte";
    import UButton from "@repo/ui-sv/components/UButton.svelte";
    import MenuItem from "@repo/ui-sv/components/MenuItem.svelte";
    import Genres from "./Genres.svelte";
    import { page } from "$app/stores";
    import TuModal from "@repo/ui-sv/components/TuModal.svelte";
    import { appStore } from "@/stores/app.svelte";

    let { user } = $derived(userStore);
    let { ready } = $derived(appStore);
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
    <div class="navbar-">
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
    <div class="flex-1 text-center">
        <a href="/" class="m-auto btn btn-ghost normal-case text-xl">{SITE}</a>
    </div>

    <div class="">
        <div id="nav-menu">
            <ul class="menu menu-horizontal p-0 px-4 md:flex" bind:this={menu}>
                <li>
                    <TuLink to="/movies">Movies</TuLink>
                </li>
                <li>
                    <TuLink to="/tv">Shows</TuLink>
                </li>
                <li>
                    <TuModal>
                        {#snippet toggler()}
                            Genres
                        {/snippet}
                        {#snippet content()}
                            <Genres />
                        {/snippet}
                    </TuModal>
                </li>
                <li>
                    <TuLink
                        class="text- btn btn-outline btn-sm btn-secondary"
                        target="_blank"
                        to="https://w.tstreamz.xyz"
                        >WWE <span class="badge badge-secondary badge-sm"
                            >NEW</span
                        ></TuLink
                    >
                </li>
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
                        <MenuItem
                            reload
                            to="/me/profile"
                            icon="fi fi-br-circle-user">Profile</MenuItem
                        >
                        <MenuItem
                            reload
                            to={`/me/watchlist`}
                            icon="fi fi-br-bookmark">Watchlist</MenuItem
                        >
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
                <UButton loading={!ready}>
                    {#if ready}
                        <TuLink
                            reload
                            to={`/auth/login?red=${$page.url.pathname.includes("auth") ? "/" : $page.url.href.replace($page.url.origin, "")}`}
                            class="btn btn-sm btn-outline btn-primary"
                        >
                            Login
                        </TuLink>
                    {/if}
                </UButton>
            </div>
        {/if}
    </div>
</div>
