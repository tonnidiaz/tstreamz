<script lang="ts">
    import type { IObj } from "@cmn/utils/interfaces";
    import UButton from "@repo/ui-sv/components/UButton.svelte";

    const {index, headlines} : {index?: number; headlines: IObj} = $props()
    let origin = $derived(new URL(headlines.link).hostname.replace("www.", ""))
</script>

<div class="headlines-card bg-base-200 shadow-lg flex flex-col border-1 border-card">
    <img src={true ? headlines.photo_url: "/assets/images/test-headlines-img.jpg"} alt="headlines thumbnail">
    <div class="headlines-card-content flex-1">
        <div class="headlines-card-meta p-1 bg-primary mb-2">
            <a href={origin} target="_blank" class="text-white fw-6 font-monospace">{origin}</a>
        </div>
        <h2>{headlines.title}</h2>
        <p>{headlines.snippet}</p>
    </div>
    <div class="px-2 mb-3">
        <a href={headlines.link} target="_blank" class="btn btn-sm btn-primary">Read more</a>
    </div>
</div>
<style lang="scss">
    .headlines-card-meta{
        width: fit-content;
        padding-right: 2.8rem;
        position: relative;
    }
    .headlines-card-meta::after{
        bottom: 0px;
    content: "";
    height: 0px;
    position: absolute;
    right: 0px;
    width: 0px;
    border-bottom: 20px solid oklch(var(--b2));
    border-left: 40px solid transparent;
    }
</style>