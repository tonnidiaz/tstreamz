<script>
    import { goto } from "$app/navigation";
    import CardPh from "@/components/CardPH.svelte";
    import FixedMovieCard from "@/components/FixedMovieCard.svelte";
    import TMeta from "@/components/TMeta.svelte";
    import { SITE } from "@/lib/constants";
    import { appStore } from "@/stores/app.svelte";
    import { homeStore as _homeStore } from "@/stores/home.svelte";
    import { userStore } from "@/stores/user.svelte";
    
    let {watchlist, user} = $derived(userStore)
    let {ready} = $derived(appStore)
    $effect(() => {
        if (!ready) return;
        console.log({ready});
        if (!user?.username) {
            goto(`/auth/login?red=${location.pathname}`);
        }
    })
</script>
<div>
    <TMeta title={`My Watchlist - ${SITE}`} />
    <div>
        <div>
            <div class="body">
                <div class="mt-10">
                    <h1 class="title text-center mb-4">My Watchlist</h1>
                    {#if ready && user?.username}
                    <div class="sections">
                        <section>
                        <h2 class="he">Movies</h2>
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
                        <h2 class="he">TV shows</h2>
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
                    {:else}
                    <div class="loading-div">
                        <span class="loading loading-lg"></span>
                    </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>