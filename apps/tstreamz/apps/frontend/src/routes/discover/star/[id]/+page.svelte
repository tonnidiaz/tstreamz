<script lang="ts">
    import { imgUrl, ROOT, SITE } from "@/lib/constants";
    import { preventScroll } from "@/lib/funcs";
    import FixedMovieCard from "@/components/FixedMovieCard.svelte";
    import TMeta from "@/components/TMeta.svelte";
    import Loader from "@repo/ui-sv/components/Loader.svelte";
    import { onMount } from "svelte";

    let movies = $state<[any]>(),
        star = $state<any>();

    const { data } = $props();

    onMount(() => {
        movies = data.movies;
        star = data.star;
    });
</script>

{#if star}
    <div>
        <TMeta
            title={"Discover movies with " + star?.name + " - " + SITE}
            desc={`Discover some of the best movies with ${star?.name}.`}
            url={`/discover/star/${star?.id}`}
            src={imgUrl + star?.profile_path}
        />

        {#if movies}
            <div class="pdy-4">
                <section class="mb-4"><div
                        style="flex-shrink: 0"
                        class="w-150px h-150px pos-rel pd-2 border-1 border-card br-4 m-auto bg-base-200"
                    >
                        <img
                            alt="Movie  banner"
                            loading="lazy"
                            class="br-4"
                            width="100%"
                            height="auto"
                            src={imgUrl + star?.profile_path}
                        />
                    </div>
                    <h3 class="text-center text-white fs-18">
                        Movies with <span class="text-primary"
                            >{star?.name}</span
                        >
                    </h3>
                    
                </section>

                <section style="margin-top: -20" class="">
                    <div>
                        <FixedMovieCard {movies} wrap />
                    </div>
                </section>
            </div>
        {:else}
            <div
                ontouchmove={preventScroll}
                onwheel={preventScroll}
                class="d-flex ai-center jc-center loda"
            >
                <p class="fs-40"><span class="loading loading-lg"></span></p>
            </div>
        {/if}
    </div>
{:else}
    <Loader />
{/if}
