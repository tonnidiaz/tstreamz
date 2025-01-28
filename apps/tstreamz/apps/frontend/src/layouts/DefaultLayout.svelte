<script lang="ts">
    import Loader from "@repo/ui/components/Loader.svelte";
    import { onMount } from "svelte";
    import { appStore, setGenres, setReady } from "@/stores/app.svelte";
    import { localApi } from "@/lib/api";
    import { setUser, setWatchlist } from "@/stores/user.svelte";

    import axios from "axios";
    import { handleErrs } from "@cmn/utils/funcs";
    import { dev } from "$app/environment";
    import Footer from "@/components/Footer.svelte";
    import Navbar from "@/components/Navbar.svelte";
    import Sidebar from "@/components/Sidebar.svelte";
    import { page } from "$app/stores";
    import PellerPopunder from "@/components/PellerPopunder.svelte";
    import { enablePopunderAds } from "@/lib/constants";

    let { ready } = $derived(appStore);
    let { children } = $props();

    async function getWatchlist() {
        try {
            const r = await localApi.get("/user/watchlist");
            setWatchlist(r.data);
        } catch (err) {
            handleErrs(err);
        }
    }
    const getUser = async () => {
        try {
            const res = await localApi.post("/auth/login?q=token", {});
            setUser(res.data.user);
        } catch (e) {
            console.log(e);
        }
    };
    const init = async () => {
        await getUser();
        await getWatchlist();
        setReady(true);
    };

    onMount(async () => {
        init();
        const { data } = await axios.get("/api/genres");
        setGenres(data.genres);
    });

    $effect(()=>{
        const p =$page.url.pathname;
        p;
        console.log({p});
    })
</script>

<svelte:head>
    <!-- Adsterra popunder -->
    <!-- <script type='text/javascript' src='//digestsolicitorpolar.com/3b/16/a9/3b16a9e043d8c3d9497ea521e59eb211.js'></script> -->
    <!--  -->
</svelte:head>
{#if !$page.url.pathname.includes('/me') && enablePopunderAds}
    <PellerPopunder/>
{/if}
{#if !ready && false}
    <Loader />
{:else}
    <div>
        <Navbar />
        <div class="tu-app">
            <Sidebar />
            <main class="relative flex flex-col" style="padding: 0 10px; overflow-x:hidden">
                <div style="flex: 1">
                    {@render children()}
                </div>

                <Footer />
            </main>
        </div>
    </div>
{/if}


