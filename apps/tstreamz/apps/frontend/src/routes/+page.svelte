<script>
    import CardPh from "@/components/CardPH.svelte";
    import FixedMovieCard from "@/components/FixedMovieCard.svelte";
    import TerraBanner from "@/components/TerraBanner.svelte";
    import TMeta from "@/components/TMeta.svelte";
    import { homeStore } from "@/stores/home.svelte";

    let _homeStore = $derived(homeStore)
</script>
<div>
    <TMeta />
    <div>
        <div>
            <div class="body">
                <div class="mt-10">
                    <h1 class="text-center fs-24 fw-7">
                        <b>
                            Tuned<span class="color-orange"
                                >Streamz</span
                            ></b
                        >
                    </h1>
                    <input type="text" class="hidden input-bordered">
                    <p class="text-center text-white mt-1">
                        Watch all your favorite
                        <span class="color-orange">Movies</span> And
                        <span class="color-orange">TV Shows</span> in
                        <span class="color-orange"> HD</span>!
                    </p>
                    <div class="flex flex-col gap-3">
                        <section>
                        <h2 class="mb-2 he">Top Shows</h2>
                        <div class="">
                            {#if _homeStore.topShows}
                                <FixedMovieCard
                                isShow={true}
                                name="Prop"
                                movies={homeStore.topShows}
                            />
                            {:else}
                            <CardPh movies={[...Array(50)]} />
                            {/if}
                            
                        </div>
                    </section>
                    <section>
                        <h2 class="mb-2 he">Top Movies</h2>
                        <div class="">
                            {#if  homeStore.topMovies}
                            <FixedMovieCard

                                name="Prop"
                                movies={homeStore.topMovies}
                            />
                            {:else}
                            <CardPh movies={[...Array(50)]} />
                            {/if}
                        </div>

                    </section>
                    <TerraBanner />
                    <section>
                        <h3 class="mb-2 he">popular Shows</h3>
                        <div class="">
                            {#if homeStore.popularShows}
                                <FixedMovieCard
                                isShow
                                name="Prop"
                                movies={homeStore.popularShows}
                            />
                            {:else}
                            <CardPh  movies={[...Array(50)]} />
                            {/if}
                            
                        </div>
                    </section>
                    <section>
                        <h2 class="mb-2 he">popular Movies</h2>
                        <div class="">
                            {#if homeStore.popularMovies}
                                <FixedMovieCard
                                name="Prop"
                                movies={homeStore.popularMovies}
                            />
                            {:else}
                            <CardPh movies={[...Array(50)]} />
                            {/if}
                            
                        </div>
                    </section>
                    <TerraBanner />
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</div>