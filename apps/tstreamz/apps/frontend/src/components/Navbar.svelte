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
    const menuItems = [
        [
            {
                label: "Profile",
                icon: "i-heroicons-user-circle-20-solid",
            },
        ],
    ];

    onMount(() => {
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
                tabindex="0"
                class="menu menu-menu menu-sm text-left justify-start open border-1 border-card dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-md"
            >
                <li><TuLink to="/">Home</TuLink></li>
                <li>
                    <TuLink to="/test/arbit/cross/coins"
                        >Cross-arbit cointest</TuLink
                    >
                </li>
                <li><UDivider/></li>
                <li>
                    <TuLink to="/test/arbit/compare/cross/coins"
                        >Cross-comp arbit cointest</TuLink
                    >
                </li>
                <li>
                    <TuLink to="/test/arbit/compare/coins"
                        >Tri-comp arbit cointest</TuLink
                    >
                </li>
                <li><TuLink to="/rf/ws/book-ticker">RF Book Ticker</TuLink></li>
                <li><TuLink to="/rf/nets">Networks</TuLink></li>
                <li><TuLink to="/app/config">App config</TuLink></li>
                <li><TuLink to="/data/books">Orderbooks</TuLink></li>
                <li><TuLink to="/test/candles">Candletest</TuLink></li>
            </ul>
        </div>
    </div>
    <div class="navbar-center">
        <a href="/" class="btn btn-ghost normal-case text-xl">{SITE}</a>
    </div>
    <div class="navbar-end">
        <ul class="menu menu-horizontal p-0 px-1 md:flex hidden">
            <li>
                <TuLink to="/movies">Movies</TuLink>
            </li>
            <li>
                <TuLink to="/tv">Shows</TuLink>
            </li>
            <li>
                <CtxMenu2 anchor="top">
                    {#snippet toggler()}
                        Genre
                    {/snippet}
                    <Genres />
                </CtxMenu2>
            </li>
        </ul>

    

        {#if user}
            <div class="relative">
                <CtxMenu2 class="relative mr-4">
                    {#snippet toggler()}
                        <UAvatar class="pointer"
                            ><span class="text-md fw-7"
                                >{user.username.slice(0, 1).toUpperCase()}</span
                            ></UAvatar
                        >
                    {/snippet}
                    <ul>
                        <MenuItem
                        to="/profile"
                        icon="i-heroicons-user-circle-16-solid"
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
