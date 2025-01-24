<script lang="ts">
    import "@repo/ui/styles/all.scss";
    import "@flaticon/flaticon-uicons/css/all/all.css";
    import Navbar from "@repo/ui/components/Navbar.svelte";
    import TuLink from "@repo/ui/components/TuLink.svelte";

    let { children } = $props();
</script>

<svelte:head>
    <title>Tu sv app</title>
</svelte:head>

<Navbar site={"Tu sv app"} ready={true}>
    {#snippet menuItems()}
        <li><TuLink to="/about">About</TuLink></li>
    {/snippet}
</Navbar>
<div class="tu-app full w-full justify-center oy-scroll">
    {@render children()}
</div>
