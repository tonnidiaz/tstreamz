<script lang="ts">
    import { page } from "$app/state";
    import TMeta from "@/components/TMeta.svelte";
    import { SITE } from "@/lib";
    import type { IVideo } from "@/lib/interfaces";
    import TuLink from "@repo/ui/components/TuLink.svelte";
    import UButton from "@repo/ui/components/UButton.svelte";

    let embedUrl = $state("");
    let { data, url } = $derived(page);

    let video: IVideo = $derived(data.video);
    let date = $derived(new Date(video.date).toISOString().split('T')[0])
    let part = $derived(url.searchParams.get("part") || "1");
    let frame: HTMLIFrameElement | undefined = $state();

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

<TMeta title={`${video.title} ${date} - ${SITE}`}/>
<div class="h-full p-4 w-full flex flex-col gap-3">
    <div class="sandes br-10">
        <div class="w-full tu-wwe-frame">
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
            <div class="loading-div"><span class="loading"></span></div>
        </iframe>
        </div>

        <!-- <div style="position:relative;padding-bottom:56.25% !important;height:0;"><iframe title="frame" style="position:absolute;top:0;left:0;border:0;width:100%;height:100%" src="//vidsports.xyz/watch?v=8378" frameborder="0" allowfullscreen scrolling="no"></iframe></div> -->
    </div>
    
    <div
        class="border- border-car rounded-md p-3 sandes"
    >
    <div class="">
        <h2 class="title">{video.title}: <span class="text-secondary">{date}</span></h2>
        
    </div>
    <div class="flex justify-start gap-2 mt-2 flex-wrap ">
         {#each video.links as link, i}
            <TuLink
                to={`${url.pathname}?part=${i + 1}`}
                class={`btn btn-sm btn-primary ${Number(part) !== i + 1 && "btn-outline"}`}
                >{link.label}</TuLink
            >
        {/each}
    </div>
       
    </div>
</div>

<style lang="scss">

    .video-frame{
        height: unset;
    }
    .tu-wwe-frame {
        position: relative;
        padding-bottom: 350px;//56.25% !important;
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
