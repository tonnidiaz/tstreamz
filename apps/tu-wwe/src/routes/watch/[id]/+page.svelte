<script lang="ts">
    import { dev } from "$app/environment";
    import { page } from "$app/state";
    import TMeta from "@/components/TMeta.svelte";
    import VideoCards from "@/components/VideoCards.svelte";
    import { SITE } from "@/lib";
    import { api } from "@/lib/api";
    import { dummyNews } from "@/lib/consts";
    import { handleErrs, isTuError } from "@cmn/utils/funcs";
    import type { IObj } from "@cmn/utils/interfaces";
    import type { IVideo } from "@cmn/utils/tu-wwe/interfaces";
    import TuCarousel from "@repo/ui/components/TuCarousel.svelte";
    import TuLink from "@repo/ui/components/TuLink.svelte";
    import UButton from "@repo/ui/components/UButton.svelte";
    import UDivider from "@repo/ui/components/UDivider.svelte";
    import { showToast } from "@repo/ui/lib/funcs";

    let embedUrl = $state("");
    let { data, url } = $derived(page);

    let video: IVideo = $derived(data.video);
    let { id } = $derived(page.params);
    let related: IObj[] | undefined = $state();
    let date = $derived(new Date(video.date).toISOString().split("T")[0]);
    let part = $derived(url.searchParams.get("part") || "1");
    let frame: HTMLIFrameElement | undefined = $state();

    const getRelatedVideos = async (id: string) => {
        try {
            related = undefined;
            const { data } = await api.get(`/videos`, {
                params: {
                    side: video.side,
                    limit: 25,
                    page: 1,
                },
            });

            related = data;
        } catch (err) {
            related = [];
            handleErrs(err);
            showToast({
                msg: isTuError(err) || "Failed to fetch related videos",
                err: true,
            });
        }
    };

    $effect(() => {
        id;
        getRelatedVideos(id);
    });
    $effect(() => {
        frame;
        if (frame) {
            frame.onload = () => {
                console.log("Frame data loaded");
            };
        }
    });
    $effect(() => {
        part;
        embedUrl = video.links[Number(part) - 1].url;
    });
</script>

<TMeta title={`${video.title} ${date} - ${SITE}`} />
<div class="h-full p-4 w-full flex flex-col gap-3">
    <div class="sandes br-10 flex flex-col items-center pos-rel">
        <div class="loading-div pos-abs">
            <span class="loading loading-bars loading-lg"></span>
        </div>

        <div class="w-full tu-wwe-frame">
            {#if !dev}
                <iframe
                    bind:this={frame}
                    title="Tu WWE frame"
                    width="100%"
                    allowFullScreen
                    class="tu"
                    scrolling="no"
                    frameborder="0"
                    src={embedUrl}
                >
                </iframe>
            {/if}
        </div>

        <!-- <div style="position:relative;padding-bottom:56.25% !important;height:0;"><iframe title="frame" style="position:absolute;top:0;left:0;border:0;width:100%;height:100%" src="//vidsports.xyz/watch?v=8378" frameborder="0" allowfullscreen scrolling="no"></iframe></div> -->
    </div>

    <div class="border- border-car rounded-md p-3 sandes">
        <div class="">
            <h2 class="title">
                {video.title}: <span class="text-secondary">{date}</span>
            </h2>
        </div>
        <div class="flex justify-start gap-2 mt-2 flex-wrap">
            {#each video.links as link, i}
                <TuLink
                    to={`${url.pathname}?part=${i + 1}`}
                    class={`btn btn-sm btn-primary ${Number(part) !== i + 1 && "btn-outline"}`}
                    >{link.label}</TuLink
                >
            {/each}
        </div>
    </div>
    <section class="p">
        <h3 class="he">Related</h3>
        <div class="mt-4">
            <VideoCards videos={related} />
        </div>
    </section>
    <UDivider class="my-4"/>
  
    <section class="mb-4">
        <h3 class="he text-center">WWE news</h3>
        <TuCarousel>
            {#each dummyNews as news}
                <div class="carousel-item w-300px p-3 border-1 border-card br-5" style="height: 150px;">
                    <div class="h-100p flex flex-col">
                        <img
                            src={news.images[0]}
                            alt="Thumbnail"
                            class="w-100p flex-1"
                            style="object-fit: contain;"
                        />
                        <div class="mt-2">
                            <h4 class="fw-6 text-secondary">{news.headline}</h4>
                            <p class="fs-14">{news.description}</p>
                        </div>
                    </div>
                </div>
            {/each}
        </TuCarousel>
    </section>
</div>

<style lang="scss">
    .video-frame {
        height: unset;
    }
    .tu-wwe-frame {
        position: relative;
        padding-bottom: 350px; //56.25% !important;
        height: 0;
        iframe {
            background: transparent;
            position: absolute;
            top: 0;
            left: 0;
            border: 0;
            width: 100%;
            height: 100%;
            color-scheme: normal;
            padding: 0px;
        }
    }
</style>
