<script lang="ts">
    import VideoCards from "@/components/VideoCards.svelte";
    import { SITE, SITE_SLOGAN } from "@/lib";
    import { api } from "@/lib/api";
    import { capitalizeFirstLetter, handleErrs } from "@cmn/utils/funcs";
    import type { IObj } from "@cmn/utils/interfaces";
    import { showSides } from "@cmn/utils/tu-wwe/consts";
    import type { IVideoSide } from "@cmn/utils/tu-wwe/interfaces";
    import { onMount } from "svelte";

    let shows: { [key: string]: IObj[] } = $state({});
    const sides = showSides.filter((el) => el != "all");

    async function fetchShows(side: IVideoSide) {
        try {
            shows[side] = undefined;
            const { data } = await api.get("/videos", {
                params: { side, page: 1, limit: 100 },
            });
            shows[side] = data;
        } catch (err) {
            shows[side] = [];
            handleErrs(err);
        }
    }
    const init = () => {
        for (let side of sides) {
            fetchShows(side);
        }
    };

    onMount(()=>{
        init()
    })
</script>

<div class="p-4 w-full h-fit">
    <div class="mb-4 text-center">
       <h1 class="title">{SITE}</h1> 
       <p class="fw-6 text-primary">{SITE_SLOGAN}</p>
    </div>
    
    <div class="w-full flex flex-col gap-8">
        {#each sides as side}
            <section class="p">
                <h3 class="he">
                    <span class="text-secondary"
                        >{capitalizeFirstLetter(
                            side == "ppv" ? "Pay-Per-View" : side
                        )}</span
                    > shows
                </h3>
                <div class="mt-4">
                    <VideoCards videos={shows[side]} />
                </div>
            </section>
        {/each}
    </div>
</div>
