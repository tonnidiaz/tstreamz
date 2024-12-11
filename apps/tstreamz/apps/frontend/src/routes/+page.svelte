<script>
    import CardPh from "@/components/CardPH.svelte";
    import FixedMovieCard from "@/components/FixedMovieCard.svelte";
    import TerraBanner from "@/components/TerraBanner.svelte";
    import TMeta from "@/components/TMeta.svelte";
    import { localApi } from "@/lib/api";
    import { SITE } from "@/lib/constants";
    import { homeStore as _homeStore, setPopularShows, setTopMovies, setPopularMovies, setTopShows } from "@/stores/home.svelte";
    import { handleErrs, randomInRange } from "@cmn/utils/funcs";
    import { onMount } from "svelte";

    let homeStore = $derived(_homeStore)

    async function getPopularShows() {
    try{
    const url = "/shows?t=popular&page=" + randomInRange(1, 100);
    const { data } = await localApi.get(url);
    setPopularShows(data.data);
    }
    catch(e){
        handleErrs(e)
    }
}
async function getTopShows() {
    try{
    const url = "/shows?t=top&page=" + randomInRange(1, 100);
    const { data } = await localApi.get(url);
    setTopShows(data.data);
    }
    catch(e){
        handleErrs(e)
    }
}
async function getPopularMovies() {
    try{
    const url = "/movies?t=popular&page=" + randomInRange(1, 100);
    const { data } = await localApi.get(url);
    setPopularMovies(data.data);
    }
    catch(e){
        handleErrs(e)
    }
}
async function getTopMovies() {
    try{
    const url = "/movies?t=top&page=" + randomInRange(1, 100);
    const { data } = await localApi.get(url);
    setTopMovies(data.data);
    }
    catch(e){
        handleErrs(e)
    }
}

const getContent = async () => {
    await getTopShows();
    await getTopMovies();
    await getPopularShows();
    await getPopularMovies();
};

onMount(()=>{getContent()})
</script>
<div>
    <TMeta/>
    <div>
        <div>
            <div class="body">
                <div class="mt-10">
                    <h1 class="text-center fs-24 fw-7">
                        <b>
                            Tuned<span class="text-primary"
                                >Streamz</span
                            ></b
                        >
                    </h1>
                    <p class="text-center text-white mt-1">
                        Watch all your favorite
                        <span class="text-primary">Movies</span> And
                        <span class="text-primary">TV Shows</span> in
                        <span class="text-primary"> HD</span>!
                    </p>
                    <div class="sections">
                        <section>
                        <h2 class="he">Top Shows</h2>
                        <div class="">
                            {#if homeStore.topShows}
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
                        <h2 class="he">Top Movies</h2>
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
                        <h3 class="he">popular Shows</h3>
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
                        <h2 class="he">popular Movies</h2>
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