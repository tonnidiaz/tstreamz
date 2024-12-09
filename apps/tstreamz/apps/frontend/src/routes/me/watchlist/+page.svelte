<script>
    import CardPh from "@/components/CardPH.svelte";
    import FixedMovieCard from "@/components/FixedMovieCard.svelte";
    import TerraBanner from "@/components/TerraBanner.svelte";
    import TMeta from "@/components/TMeta.svelte";
    import { localApi } from "@/lib/api";
    import { SITE } from "@/lib/constants";
    import { homeStore as _homeStore, setPopularShows, setTopMovies, setPopularMovies, setTopShows } from "@/stores/home.svelte";
    import { userStore } from "@/stores/user.svelte";
    import { handleErrs, randomInRange } from "@cmn/utils/funcs";
    import { onMount } from "svelte";

    let {watchlist} = $derived(userStore)

</script>
<div>
    <TMeta title={`My Watchlist - ${SITE}`} />
    <div>
        <div>
            <div class="body">
                <div class="mt-10">
                    <h1 class="title text-center mb-4">My Watchlist</h1>
                    <div class="flex flex-col gap-3">
                        <section>
                        <h2 class="mb-2 he">Movies</h2>
                        <div class="">
                            {#if watchlist.movies}
                                <FixedMovieCard
                                name="Prop"
                                movies={watchlist.movies.toReversed()}
                            />
                            {:else}
                            <CardPh movies={[...Array(50)]} />
                            {/if}
                            
                        </div>
                    </section>
                        <section>
                        <h2 class="mb-2 he">TV shows</h2>
                        <div class="">
                            {#if watchlist.shows}
                                <FixedMovieCard
                                isShow={true}
                                name="Prop"
                                movies={watchlist.shows.toReversed()}
                            />
                            {:else}
                            <CardPh movies={[...Array(50)]} />
                            {/if}
                            
                        </div>
                    </section>
                  
                    
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</div>