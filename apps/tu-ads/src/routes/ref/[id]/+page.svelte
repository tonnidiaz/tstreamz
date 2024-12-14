<script lang="ts">
    import { page } from "$app/stores";
    import Banner from "@/components/Banner.svelte";
    import UButton from "@repo/ui/components/UButton.svelte";
    import axios from "axios";
    import { onMount } from "svelte";
    import { getRandomBoolean } from "$lib/funcs";
    import { directLinks, pellerLinks } from "@/lib/consts";


    const ipUrl = "https://api.ipify.org/?format=json";
    let ip = $state(),
        agent = $state();

    const getIpAddr = async () => {
        try {
            console.log("Getting ip address...");
            ip = undefined;
            const r = await axios.get(ipUrl);
            ip = r.data.ip;
        } catch (err) {
            console.log(err);
        }
    };

    onMount(() => {
        getIpAddr();
        agent = navigator.userAgent;
    });

    function handleLinkClick(link: string): any {
        if (getRandomBoolean()) {
            window.open(link, "_blank");
        } else {
            console.log("pass");
        }
    }
</script>

<div class="p-5">
    <p><b>IP: </b> {ip || "No ip"}</p>
    <p><b>Agent: </b> {agent}</p>
    <p><b>N: </b> {$page.params.id}</p>
    <div class="my-4">
        <h3>Links</h3>
        <div class="flex gap-2">
            {#each pellerLinks as link, i}
                <UButton
                    onclick={async () => await handleLinkClick(link)}
                    class="btn-primary link-btn">Link {i + 1}</UButton
                >
            {/each}
        </div>
    </div>
    <div class="p-4">
        <Banner num={Number($page.params.id) as any} />
    </div>
</div>
