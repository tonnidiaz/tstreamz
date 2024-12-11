<script lang="ts">
    import { localApi } from "@/lib/api";
    import {
        setTrailerId,
        setTrailerErr,
        appStore as _appStore,
    } from "@/stores/app.svelte";
    import { handleErrs } from "@cmn/utils/funcs";
    import TuModal from "@repo/ui/components/TuModal.svelte";
    import UButton from "@repo/ui/components/UButton.svelte";
    import _$ from "jquery";

    let appStore = $derived(_appStore);
    let modalOpen = $state(false);
    const {
        isShow,
        id,
        className,
        class: _class,
    }: {
        isShow?: boolean;
        id: number;
        className?: string;
        class?: string;
    } = $props();
    function showTrailer(id: number) {
        setTrailerId(null);
        setTrailerErr(null);
        modalOpen = true;
        const url = isShow ? "/trailer/tv/" + id : "/trailer/m/" + id;
        localApi
            .get(url)
            .then((r) => {
                const { trailer } = r.data;

                if (trailer?.key) setTrailerId(trailer.key);
                else setTrailerErr("true");
            })
            .catch((e) => {
                handleErrs(e);
                setTrailerErr("true");
            });
    }
</script>

<UButton
    onclick={() => showTrailer(id)}
    title="Show trailer"
    class={"pos-rel btn-secondary items-center justify-center flex " +
        (className ? className : "btn-outline btn-secondary") +
        ` ${_class || ""}`}
>
    <span>
        <i class="fi fi-rr-film"></i>
    </span>
    <span>Trailer</span>
</UButton>

<TuModal
    bind:open={modalOpen}
    class="border-1 border-card p-2 w-600px max-w-800"
>
    {#snippet content()}
        <div
            class="relative h-100p trailer bg-blue-2 p-1 d-flex jc-center ai-center pos-rel"
        >
            {#if appStore.trailerId}
                <div class="video-cont">
                    <iframe
                        title="Trailer frame"
                        width="100%"
                        height="100%"
                        class="rounded-md"
                        allowFullScreen
                        frameborder="0"
                        src={"https://www.youtube.com/embed/" +
                            appStore.trailerId}
                    ></iframe>
                </div>
            {:else if !appStore.trailerId && !appStore.trailerErr}
                <div class="loading-div">
                    <p class="text-white fs-20">
                        <span class="loading loading-md loading-bars"></span>
                    </p>
                </div>
            {:else}
                <div class="loading-div">
                    <div class="t-c">
                        <p style="margin-bottom: 0">404</p>
                        <p class="he">Could not get trailer</p>
                    </div>
                </div>
            {/if}
        </div>
    {/snippet}
</TuModal>

<style lang="scss">
    .video-cont {
        position: relative;
        padding-bottom: calc(56.25% * 1); /* 16:9 */
        width: 100%;
        height: 0;

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
</style>
