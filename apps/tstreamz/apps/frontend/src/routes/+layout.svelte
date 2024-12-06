<script lang="ts">
    import "@/styles/styles3.scss";
    import "@/styles/globals.css";
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
        setReady,
    } from "@/stores/app.svelte";
    import { localApi } from "@/lib/api";
    import { setUser } from "@/stores/user.svelte";
    import Navbar from "@/components/Navbar.svelte";
    import Sidebar from "@/components/Sidebar.svelte";
    import Loader from "@repo/ui/components/Loader.svelte";
    let { children } = $props();
    let { ready } = $derived(appStore);

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
        setReady(true);
    };

    onMount(() => {
       
        init();
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
            <main style="padding: 0 10px">
                {@render children()}
            </main>
        </div>
    </div>
{/if}
