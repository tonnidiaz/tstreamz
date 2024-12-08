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
    import { onMount } from "svelte";
    import {
        appStore,
        setGenres,
        setReady,
    } from "@/stores/app.svelte";
    import { localApi } from "@/lib/api";
    import { setUser, setWatchlist } from "@/stores/user.svelte";
    import Navbar from "@/components/Navbar.svelte";
    import Sidebar from "@/components/Sidebar.svelte";
    import Loader from "@repo/ui/components/Loader.svelte";
    import axios from "axios";
    import { handleErrs } from "@cmn/utils/funcs";
    import { dev } from "$app/environment";
    import Footer from "@/components/Footer.svelte";
    let { children } = $props();
    let { ready } = $derived(appStore);
    async function getWatchlist() {
        try{
            console.log("Getting watchlist...");
            const r =await localApi.get("/user/watchlist")
            setWatchlist(r.data)
            console.log('Wtachlist updated');
            if (dev) console.log(r.data);
        }
        catch(err){
            handleErrs(err);
        }
    
}
    const getUser = async () => {
        try {
            console.log("GETTING USER");
            const res = await localApi.post("/auth/login?q=token", {});
            setUser(res.data.user);
            
        } catch (e) {
            console.log(e);
        }
    };
    const init = async () => {
        //console.log(pagesWithLayout.indexOf(location.pathname ) == -1 );
        await getUser();
        await getWatchlist()
        setReady(true);
    };

    onMount(async() => {
       
        init();
        const {data} = await axios.get("/api/genres");
        setGenres(data.genres);
    });


    function handleErrors(err: Error): void {
        // throw new Error("Function not implemented.");
        console.log("Handle IO err");
        return
        if (err.message.includes('ERR_CONNECTION_REFUSED')) {
        console.log('Suppressed connection error:', "err.message");
    } else {
        console.error("err");
    }
    }
</script>

{#if !ready}
    <Loader />
{:else}
    <div>
        <Navbar />
        <div class="tu-app">
            <Sidebar/>
            <main  class="relative flex flex-col" style="padding: 0 10px">
                <div style="flex: 1">
               {@render children()}     
                </div>
                
                <Footer/>
            </main>
        </div>
        
    </div>
{/if}
