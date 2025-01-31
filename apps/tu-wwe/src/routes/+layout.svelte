<script lang="ts">
    import "@repo/ui-sv/styles/all.scss";
    import "@flaticon/flaticon-uicons/css/all/all.css";
    import "@/styles/main.scss";
    import Navbar from "@repo/ui-sv/components/Navbar.svelte";
    import TuLink from "@repo/ui-sv/components/TuLink.svelte";
    import { SITE } from "@/lib";
    import { appStore, updateAppStoreField } from "@/stores/app.svelte";
    import { onMount } from "svelte";
    import { handleErrs, isTuError, sleep } from "@cmn/utils/funcs";
    import { showToast } from "@repo/ui-sv/lib/funcs";
    import { api } from "@/lib/api";
    import { dev } from "$app/environment";
    import Loader from "@repo/ui-sv/components/Loader.svelte";
    import TMeta from "@/components/TMeta.svelte";
    import Footer from "@/components/Footer.svelte";
    let { children } = $props();
    let { ready } = $derived(appStore);

    async function getTotalVideos() {
        try {
            if (dev) console.log("Fetchng videos count...");
            const { data } = await api.get("/videos?count=true");
            console.log(data);
            updateAppStoreField("totalVids", data);
        } catch (err) {
            handleErrs(err);
            showToast({
                err: true,
                msg: isTuError(err) || "Failed to get videos total.",
            });
        }
    }
    const init = async () => {
        await getTotalVideos();
        updateAppStoreField("ready", true);
    };
    onMount(() => {
        init();
    });
</script>

<TMeta />

<div class="h-full w-full flex flex-col">
    <Navbar
        style="position: relative !important"
        site={SITE}
        {ready}
        hasLogin={false}
    >
        {#snippet menuItems()}
            <li><TuLink to="/">Home</TuLink></li>
            <li><TuLink to="/raw">RAW</TuLink></li>
            <li><TuLink to="/smackdown">Smackdown</TuLink></li>
            <li><TuLink to="/ppv">PPV</TuLink></li>
        {/snippet}
    </Navbar>
    <div class="flex-1 overflow-hidden pdy-6">
        <div
            class="p-3 rounded-md shadow-lg m-auto w-800px border-1 border-card rounded- oy-scroll h-full"
        >
            <div class="h-full flex flex-col">
                <div class="the-top"></div>
                <div class="flex-1 mb-10">{@render children()}</div>
                <Footer />
            </div>
        </div>
    </div>
</div>

<!-- <div class="tu-app flex flex-col pdy-13 full w-full justify-center h-full oy-">
    <div class="h-full shadow-lg m-auto w-800px border-1 border-card rounded- oy-scroll">
        {@render children()}
        <Footer/>
    </div>
    

</div> -->

{#if !ready}
    <Loader>
        <div class="text-center">
            <img
                class="blink blinker w-200px h-200px border- border-card rounded-full"
                style="object-fit: contain;"
                src="/assets/images/wwe-logo.png"
                alt="wwe loading icon"
            />
            <h3 class="fs-25 fw-6">{SITE}</h3>
        </div>
    </Loader>
{/if}
