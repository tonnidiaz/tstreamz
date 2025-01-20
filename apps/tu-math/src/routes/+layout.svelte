<script lang="ts">
	import "@repo/ui/styles/all.scss";
	let { children } = $props();
</script>
<svelte:head>
    <title>Tu mathematics</title>
</svelte:head>
{@render children()}
