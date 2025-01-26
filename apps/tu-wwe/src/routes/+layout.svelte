<script lang="ts">
    import "@repo/ui/styles/all.scss";
    import "@flaticon/flaticon-uicons/css/all/all.css";
    import Navbar from "@repo/ui/components/Navbar.svelte";
    import TuLink from "@repo/ui/components/TuLink.svelte";
    import { SITE } from "@/lib";
    import {appStore, updateAppStoreField} from '@/stores/app.svelte'
    import { onMount } from "svelte";
    import { handleErrs, isTuError, sleep } from "@cmn/utils/funcs";
    import { showToast } from "@repo/ui/lib/funcs";
    import { api } from "@/lib/api";
    import { dev } from "$app/environment";
    import Loader from "@repo/ui/components/Loader.svelte";
    import TMeta from "@/components/TMeta.svelte";
    let { children } = $props();
    let {ready} = $derived(appStore)

    async function getTotalVideos (){
        try {
            if (dev)
                console.log("Fetchng videos count...");
            const {data} = await api.get("/videos?count=true");
            console.log(data);
            updateAppStoreField("totalVids", data)
        } catch (err) {
            handleErrs(err)
            showToast({err: true, msg: isTuError(err) || "Failed to get videos total."})
            
        }
    }
    const init = async() => { 
        await getTotalVideos()
        updateAppStoreField("ready", true)
     }
    onMount(()=>{
  init()
      
    })
</script>
<TMeta/>


<Navbar site={SITE} {ready}>
    {#snippet menuItems()}
        <li><TuLink to="/raw">RAW</TuLink></li>
        <li><TuLink to="/smackdown">Smackdown</TuLink></li>
    {/snippet}
</Navbar>
<div class="tu-app full w-full justify-center oy-scroll">
    {@render children()}
</div>
{#if !ready}
    <Loader>
        <div class="text-center">
           
            <img class="blink blinker w-200px h-200px border- border-card rounded-full" style="object-fit: contain;" src="/assets/images/wwe-logo.png" alt="wwe loading icon">
            <h3 class="fs-25 fw-6">{SITE}</h3>
        </div>
        
    </Loader>
{/if}