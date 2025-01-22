<script lang="ts">
    import { SITE } from "@/lib/conts";
	import Navbar from "@repo/ui/components/Navbar.svelte";
import "@repo/ui/styles/all.scss";
	let { children } = $props();
</script>
<svelte:head>
    <title>Tu mathematics</title>
</svelte:head>

<Navbar site={SITE} ready={true}/>
<div class="tu-app full w-full justify-center oy-scroll">
    {@render children()}
</div>


