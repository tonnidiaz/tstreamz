<script lang="ts">
   import "@repo/ui/styles/all.scss";
   import "@flaticon/flaticon-uicons/css/all/all.css";

    import { page } from "$app/state";
    import AuthLayout from "@/layouts/AuthLayout.svelte";
    import DefaultLayout from "@/layouts/DefaultLayout.svelte";
    import { onMount } from "svelte";
    import axios from "axios";
    import { handleErrs } from "@cmn/utils/funcs";
    import { appStore, setDeviceInfo } from "@/stores/app.svelte";
    import { localApi } from "@/lib/api";

    let { children } = $props();

    const authLayouts = ["/auth"];

    const addVisitor = async () => {
        try {
            let _ip = "anonymous";
            let location = "unknown";
            const ua = navigator.userAgent;
            let device = {
                user_agent: ua,
                platform: navigator.platform,
                is_mobile: /Mobi|Android/i.test(ua),
                browser: (() => {
                    if (ua.includes("Chrome")) return "Chrome";
                    if (ua.includes("Firefox")) return "Firefox";
                    if (ua.includes("Safari") && !ua.includes("Chrome"))
                        return "Safari";
                    if (ua.includes("Edge")) return "Edge";
                    return "Unknown";
                })(),
            };
            const ts = Date.now();
            try {
                const res = await axios.get("https://ipapi.co/json/");
                const data = res.data;
                _ip = res.data.ip;
                location = `${data.org}, ${data.city}, ${data.region}, ${data.country_name}`;
            } catch (e) {
                console.log("Failed to get IP");
                handleErrs(e);
            } finally {
                setDeviceInfo({device, ip: _ip, location})
            }
            
            const r = await localApi.post("/visitors?act=add", {
                ...deviceInfo, ts
            });
            console.log("Visitor added");
        } catch (err) {
            handleErrs(err);
        }
    };
    onMount(() => {
        addVisitor();
        window.addEventListener("beforeunload", onWindowClose);
        return () => {
            // onWindowClose();
            window.removeEventListener("beforeunload", onWindowClose);
        };
    });

    let { deviceInfo } = $derived(appStore);
    async function onWindowClose() {
        const ts = Date.now()
        console.log("WIndow closing...");
        await localApi.post("/visitors?act=update", { ...deviceInfo, ts });
    }
</script>

{#if authLayouts.find((el) => page.route?.id?.startsWith(el))}
    <AuthLayout>
        {@render children()}
    </AuthLayout>
{:else}
    <DefaultLayout>{@render children()}</DefaultLayout>
{/if}
