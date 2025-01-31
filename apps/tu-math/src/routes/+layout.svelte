<script lang="ts">
    import "@repo/ui-sv/styles/all.scss";
    import "@flaticon/flaticon-uicons/css/all/all.css";
    import { SITE } from "@/lib/conts";
    import Navbar from "@repo/ui-sv/components/Navbar.svelte";
    import TuLink from "@repo/ui-sv/components/TuLink.svelte";

    let { children } = $props();
</script>

<svelte:head>
    <title>Tu mathematics</title>
</svelte:head>

<Navbar site={SITE} ready={true}>
    {#snippet menuItems()}
        <li><TuLink to="/past-papers">Past papers</TuLink></li>
    {/snippet}
</Navbar>
<div class="tu-app full w-full justify-center oy-scroll">
    {@render children()}
</div>
