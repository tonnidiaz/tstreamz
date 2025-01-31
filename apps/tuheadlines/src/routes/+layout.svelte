<script lang="ts">
    import "@repo/ui-sv/styles/tw.css";
    import "@repo/ui-sv/styles/styles.scss";
    import "@repo/ui-sv/styles/styles2.scss";
    import "@repo/ui-sv/styles/styles3.scss";
    import "@repo/ui-sv/styles/scrollbar.scss";
    import "@/styles/main.scss";
    import { SITE, SITE_SLOGAN } from "@/lib/constants";
    
    import Navbar from "@/components/Navbar.svelte";
    import Footer from "@/components/Footer.svelte";
    let { children } = $props();
</script>

<svelte:head>
    <title>{SITE} - {SITE_SLOGAN}</title>
</svelte:head>
<div class="w-100p h-100p flex flex-col">
    <Navbar />
    <div class="tu-app">
        <main class="flex-1 w-100 no-bottom">
            {@render children()}
            <Footer/>
        </main>
        
    </div>
    
</div>

