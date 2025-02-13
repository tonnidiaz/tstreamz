<script lang="ts">
    import { SITE, socket } from "@/lib/constants";
    import { userStore } from "@/stores/user.svelte";
    import TuLink from "@repo/ui-sv/components/TuLink.svelte";
    import UButton from "@repo/ui-sv/components/UButton.svelte";
    import Navbar from "@repo/ui-sv/components/Navbar.svelte";
    import MenuItem from "@repo/ui-sv/components/MenuItem.svelte";
    import UAvatar from "@repo/ui-sv/components/UAvatar.svelte";
    import { onMount } from "svelte";
    import CtxMenu2 from "@repo/ui-sv/components/CtxMenu2.svelte";
    import UDivider from "@repo/ui-sv/components/UDivider.svelte";
    import { appStore } from "@/stores/app.svelte";
    let ioConnected = $state(false);
    let { user } = $derived(userStore);
    let { ready } = $derived(appStore);

    onMount(() => {
        socket?.on("connect", () => (ioConnected = true));
        socket?.on("disconnect", () => (ioConnected = false));
    });
</script>

<Navbar {user} {ready} site={SITE} hasLogin>
    {#snippet moreMenuItems()}
        <li><TuLink to="/">Home</TuLink></li>
        <li>
            <TuLink to="/test/arbit/cross/coins">Cross-arbit cointest</TuLink>
        </li>
        <li><UDivider /></li>
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
    {/snippet}

    {#snippet menuItems()}
    <li>
        <TuLink to="/about">About</TuLink>
    </li>
    <li>
        <TuLink to="/contact">Contact us</TuLink>
    </li>
    <li class="mr-4"><button class="btn btn-ghost btn-circle">
        <div class="indicator">
            IO
            <span
                class={`badge badge-xs ${ioConnected ? "badge-primary" : "badge-warning"} indicator-item`}
            ></span>
        </div>
    </button></li>
    {/snippet}
    {#snippet userMenuItems()}
        <MenuItem to="/profile" icon="i-heroicons-user-circle-16-solid"
            >Profile</MenuItem
        >
        <MenuItem
            to={`/@${user.username}/bots`}
            icon="fi fi-br-user-robot-xmarks">Bots</MenuItem
        >
        <MenuItem to={`/account`} icon="fi fi-br-user-robot-xmarks"
            >Account</MenuItem
        >
        <MenuItem to={`/auth/logout`} icon="fi fi-br-sign-out-alt"
            >Logout</MenuItem
        >
    {/snippet}
</Navbar>

<style>
</style>
