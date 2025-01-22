<script lang="ts">
    import { SITE } from "@/lib/conts";
	import Navbar from "@repo/ui/components/Navbar.svelte";
    import TuLink from "@repo/ui/components/TuLink.svelte";
import "@repo/ui/styles/all.scss";
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


