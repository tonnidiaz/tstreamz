<script lang="ts">
    import "@/styles/globals.css";
    import "@/styles/styles3.scss";
    import "@/styles/styles2.scss";
    import "@/styles/page-progress.css";
    import "@/styles/select.scss";
    import "@/styles/styles.scss";
    import "@/styles/daisy.scss";
    import "@/styles/scrollbar.scss";
    import "@/styles/components.scss";

    import { page } from "$app/stores";
    import AuthLayout from "@/layouts/AuthLayout.svelte";
    import DefaultLayout from "@/layouts/DefaultLayout.svelte";
    import { onMount } from "svelte";

    let { children } = $props();

    const authLayouts = ["/auth"];

    onMount(() => {
        
    });
</script>

{#if authLayouts.find((el) => $page.route.id.startsWith(el))}
    <AuthLayout>
        {@render children()}
    </AuthLayout>
{:else}
    <DefaultLayout>{@render children()}</DefaultLayout>
{/if}
