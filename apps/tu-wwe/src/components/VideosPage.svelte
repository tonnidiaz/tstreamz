<script lang="ts">
    import { api } from "@/lib/api";
    import { appStore } from "@/stores/app.svelte";
    import {
        capitalizeFirstLetter,
        handleErrs,
        isTuError,
    } from "@cmn/utils/funcs";
    import TuPaginator from "@repo/ui-sv/components/TuPaginator.svelte";
    import { showToast } from "@repo/ui-sv/lib/funcs";
    import VideoCards from "./VideoCards.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { untrack } from "svelte";
    import type { IVideoSide, IVideo } from "@cmn/utils/tu-wwe/interfaces";

    let { side = "all" }: { side?: IVideoSide } = $props();
    let { maxVidsPerPage, totalVids } = $derived(appStore);
    let _page = $state(1);
    let _totalVids = $derived(totalVids[side]);
    let totalPages = $derived(Math.ceil(_totalVids / maxVidsPerPage) || 1);

    let videos: IVideo[] | undefined = $state();

    const fetchVideos = async (page: number) => {
        try {
            videos = undefined;

            console.log(`\nGETTING PAGE ${page} VIDEOS(${side})`);
            const { data } = await api.get(`/videos`, {
                params: {
                    side,
                    limit: maxVidsPerPage,
                    page,
                },
            });

            videos = data;
        } catch (err) {
            videos = [];
            handleErrs(err);
            showToast({
                err: true,
                msg: isTuError(err) || "Failed to fetch videos",
            });
        }
    };

    $effect(() => {
        page.url.searchParams.get("page");
        untrack(() => {
            _page = Number(page.url.searchParams.get("page")) || 1;
        });
    });
    $effect(() => {
        _page;
        fetchVideos(_page);
    });

    let title = $derived(
        side && side == "ppv" ? "Pay-Per-View" : side || "WWE"
    );
</script>

<div class="w-full min-h-80p flex flex-col">
    <div class="flex-1">
        <h1 class="title text-center">
            <span class="text-secondary">
                {capitalizeFirstLetter(title)}
            </span> shows
        </h1>
        <div class="h-full">
            {#if !videos?.length}
                <div class="loading-div">
                    {#if !videos}
                        <span class="loading loading-lg loading-infinity"
                        ></span>
                    {:else}
                        <span class=" fw-" style="font-size: 100px;"
                            ><i class="fi fi-rr-empty-set"></i></span
                        >
                    {/if}
                </div>
            {:else}
                <div class="my-4">
                    <VideoCards wrap {videos} />
                </div>
            {/if}
        </div>
    </div>

    <TuPaginator
        total={totalPages}
        bind:page={_page}
        onNext={async () => {
            const url = `${page.url.pathname}?page=${_page + 1}`;
            await goto(url, {});
        }}
        onPrev={async () => {
            const url = `${page.url.pathname}?page=${_page - 1}`;
            await goto(url, {});
        }}
    />
</div>
