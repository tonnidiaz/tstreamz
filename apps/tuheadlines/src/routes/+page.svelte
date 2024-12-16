<script>
    import HeadlinesCard from "@/components/HeadlinesCard.svelte";
    import { dummyHeadlines } from "@/lib/constants";
    import { handleErrs, parseDate } from "@cmn/utils/funcs";
    import { page as pg } from "$app/stores";
    import { goto } from "$app/navigation";
    import { api, localApi } from "@/lib/api";
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import TerraBanner from "@/components/TerraBanner.svelte";

    const MAX_NEWS_PER_PAGE = 20;

    let headlines = $state();
    let totalHeadlines = $derived(headlines?.length || 1);
    let page = $derived(Number($pg.url.searchParams.get("page") || 1));
    let totalPages = $derived(Math.ceil(totalHeadlines / MAX_NEWS_PER_PAGE));
    let start = $derived((page - 1) * MAX_NEWS_PER_PAGE);

    async function getHeadlines() {
        try {
            console.log("Getting headlines....");
            const r = await localApi.get("/headlines");
            headlines = r.data;
            if (dev) console.log(r.data);
        } catch (err) {
            handleErrs(err);
        }
    }

    onMount(() => {
        getHeadlines();
    });
</script>

<div class="p-4 min-h-80p overflow-y-scroll no-scrollbar">
    <h1 class="text-center ttl text-white my-4">
        <span class="text-accent font-monospace"
            >{parseDate().split(" ")[0]}</span
        > TECH HEADLINES
    </h1>
    {#if headlines}
        <div class="grid md:grid-cols-3 grid-cols-1 gap-3">
            {#each headlines.slice(start, start + MAX_NEWS_PER_PAGE) as _headlines, i}
                <HeadlinesCard index={i} headlines={_headlines} />
                {#if (i + 1) % 3 === 0}
                    <div
                        class="w-100p p-1 overflow-x-scroll ad-space m-auto md:col-span-3 flex items-center justify-center"

                    >
                    <div class="grid grid-cols-1 md:grid-cols-3  gap-2 justify-center align-center">
                      <div class="md:col-span-2 bg-base-300 p-1"><TerraBanner/></div>
                      <div class="col-span- bg-base-300 p-1"><TerraBanner num={2}/></div>
                    </div>
                    
                    </div>
                {/if}
            {/each}
        </div>
    {:else}
        <div class="loading-div">
            <span class="loading loading-infinity loading-lg"></span>
        </div>
    {/if}

    <div class="divider"></div>
    <div class="mx-auto mt-4 w-100p flex justify-center">
        <div class="join shadow-lg bg-base-200 z-[51]">
            <button
                onclick={(_) => goto(`?page=${Number(page) - 1}`)}
                disabled={page == 1}
                class="join-item btn border-1 border-card bg-base-200">«</button
            >
            <button class="join-item btn border-1 border-card bg-base-200"
                >Page <span class="text-white">{page}</span> of
                <span class="text-white">{totalPages}</span></button
            >
            <button
                onclick={(_) => goto(`?page=${Number(page) + 1}`)}
                disabled={page == totalPages}
                class="join-item btn border-1 border-card">»</button
            >
        </div>
    </div>
</div>
