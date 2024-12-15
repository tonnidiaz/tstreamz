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
    import axios from "axios";
    import { handleErrs } from "@cmn/utils/funcs";
    import { appStore, setIp } from "@/stores/app.svelte";
    import { localApi } from "@/lib/api";

    let { children } = $props();

    const authLayouts = ["/auth"];

    const addVisitor = async () => {
        try {
            let _ip = "anonymous";
            const ts = Date.now()
            try {
                const res = await axios.get(
                    "https://api.ipify.org/?format=json"
                );
                _ip = res.data.ip;
            } catch (e) {
                console.log("Failed to get IP");
                handleErrs(e);
            } finally {
                setIp(_ip);
            }

            const r = await localApi.post("/visitors?act=add", {
                ip: _ip,
                ts,
            });
            console.log("Visitor added");
        } catch (err) {
            handleErrs(err);
        }
    };
    onMount(() => {
        addVisitor();
        window.addEventListener("unload", onWindowClose)
        return ()=> {
            // onWindowClose();
            window.removeEventListener("unload", onWindowClose)}
    });

    let {ip} = $derived(appStore)
    async function onWindowClose() {
        console.log('WIndow closing...');
        await localApi.post("/visitors?act=update", {ip, ts: Date.now()})
    }
</script>

{#if authLayouts.find((el) => $page.route.id.startsWith(el))}
    <AuthLayout>
        {@render children()}
    </AuthLayout>
{:else}
    <DefaultLayout>{@render children()}</DefaultLayout>
{/if}
