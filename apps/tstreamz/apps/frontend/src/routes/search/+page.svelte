<script lang="ts">
    import { page } from "$app/stores";
    import DillaBanner from "@/components/DillaBanner.svelte";
    import SearchForm from "@/components/SearchForm.svelte";
    import SearchRes from "@/components/SearchRes.svelte";
    import TerraBanner from "@/components/TerraBanner.svelte";
    import TMeta from "@/components/TMeta.svelte";
    import { localApi } from "@/lib/api";
    import { SITE } from "@/lib/constants";
    import { handleErrs } from "@cmn/utils/funcs";
    import UAccordion from "@repo/ui/components/UAccordion.svelte";
    import UCheckbox from "@repo/ui/components/UCheckbox.svelte";
    import { untrack } from "svelte";
    let query = $derived($page.url.searchParams.get("q"));

    let ready = $state<boolean>(false),
        setReady = (val: boolean) => {
            ready = val;
        };
    let movies = $state<any>(false),
        setMovies = (val: any) => {
            movies = val;
        };
    let shows = $state<any>(false),
        setShows = (val: any) => {
            shows = val;
        };
    let filter = $state({ movies: true, shows: true }),
        setFilter = (val: typeof filter) => {
            filter = val;
        };

    function handleCheck(e: any) {
        const {
            checked,
            name,
        }: { checked: boolean; name: "movies" | "shows" } = e.currentTarget;
        let newFilter = filter;
        newFilter[name] = checked;
        setFilter(newFilter);
        //setFilter({...filter.value,  :  })
    }
    function search(q: string) {
        // clear errything
        //const { setMovies, setShows} = this
        setReady(false);
        console.log("Searching...");
        localApi
            .get("/search?q=" + q)
            .then((r) => {
                const { shows, movies } = r.data.data;
                setMovies(movies);
                setShows(shows);
                setReady(true);
            })
            .catch((err) => {
                handleErrs(err);
                setReady(true);
            });
    }

    $effect(() => {
        const q = query;
        if (q) {
            untrack(() => search(`${q}`));
        }
    });
    // onBeforeMount(() => {
    //     const { q } = route.query;
    //     if (q) {
    //         search(`${q}`);
    //     }
    // });
</script>

<div class="search-page">
    <TMeta
        title={"Search Movies and TV shows - " + SITE}
        desc="Browse any movie or tv show of your preference"
        keywords="tunedstreamz search, tunedstreams search, tuned streamz search, search movies tunedstreamz, search movies, latest movies, latest series, search series tunedstreamz"
    />
    <div>
        <div class="bg-card pd-10 mb-0 tu-searchbar">
            <div class="md:w-500px m-auto">
                <SearchForm value={`${query || ""}`} />
            </div>
        </div>

        <!---
  <ShareNetwork
          network="facebook"
          url="https://news.vuejs.org/issues/180"
          title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
          description="This week, I’d like to introduce you to 'Vite', which means 'Fast'. It’s a brand new development setup created by Evan You."
          quote="The hot reload is so fast it\'s near instant. - Evan You"
          hashtags="vuejs,vite"
        >
          Share on Facebook
        </ShareNetwork>-->
        {#if query}
            <div class="m-auto">
                <section class="filter-sec m-0">
                    <h3 class="he text-center mb-0">
                        Search results for:
                        <span class="text-secondary">{query}</span>
                    </h3>
                    <div class="flex gap-3 jc-center pd-10">
                        <div class="flex flex-col gap-1 ai-center">
                            <input
                                onchange={handleCheck}
                                name="movies"
                                checked={filter.movies}
                                id="checkbox-1"
                                type="checkbox"
                                class="toggle toggle-secondary bg-secondary"
                            />
                            <label for="checkbox-1">Movies</label>
                        </div>
                        <div class="flex flex-col gap-1 ai-center">
                            <input
                                onchange={handleCheck}
                                name="shows"
                                checked={filter.shows}
                                id="checkbox-2"
                                type="checkbox"
                                class="toggle toggle-secondary bg-secondary"
                            />
                            <label for="checkbox-2">TV shows</label>
                        </div>
                    </div>
                </section>
                <div class="flex flex-col gap-2 mb-4">
                    {#if filter.movies}
                        <UAccordion class="mt-4 my-50" open>
                            {#snippet label()}
                                <div class="flex justify-between ai-c he mb-0">
                                    <h4 class="">Movies</h4>
                                    <span class="font-monospace text-secondary">{movies.length || 0}</span>
                                </div>
                                
                            {/snippet}

                            {#snippet content()}
                                <div class="no-wrap ai-center">
                                    {#if ready}
                                        <div>
                                            {#if movies.length}
                                                <div>
                                                    {#each movies as it, i}
                                                        <SearchRes movie={it} />
                                                    {/each}
                                                </div>
                                            {:else}
                                                <div
                                                    class="loading-div w-100p h-100p m-0"
                                                >
                                                    <span
                                                        class="fs-30 flex ai-center mt-4"
                                                    >
                                                        <i
                                                            class="fi fi-rr-sad-tear"
                                                        ></i>
                                                    </span>
                                                </div>
                                            {/if}
                                        </div>
                                    {:else}
                                        <div class="loading-div">
                                            <span
                                                class="loading loading-lg loading-bars"
                                            ></span>
                                        </div>
                                    {/if}
                                </div>
                            {/snippet}
                        </UAccordion>
                    {/if}
                    {#if filter.shows}
                        <UAccordion>
                            {#snippet label()}
                                <div class="flex justify-between ai-c he mb-0">
                                    <h4>TV shows</h4>
                                    <span class="font-monospace text-secondary">{shows.length || 0}</span>
                                </div>
                                
                            {/snippet}
                            {#snippet content()}
                                <div class="no-wrap ai-center">
                                    {#if ready}
                                        {#if shows.length}
                                            <div>
                                                {#each shows as it, i}
                                                    <SearchRes
                                                        movie={it}
                                                        isShow
                                                    />
                                                {/each}
                                            </div>
                                        {:else}
                                            <div
                                                class="loading-div w-100p h-100p m-0"
                                            >
                                                <span
                                                    class="fs-30 flex ai-center mt-4"
                                                >
                                                    <i class="fi fi-rr-sad-tear"
                                                    ></i>
                                                </span>
                                            </div>
                                        {/if}
                                    {:else}
                                        <div class="loading-div">
                                            <span
                                                class="loading loading-lg loading-bars"
                                            ></span>
                                        </div>
                                    {/if}
                                </div>
                            {/snippet}
                        </UAccordion>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
    <DillaBanner />
    <TerraBanner />
</div>

<style lang="scss">
    .tu-searchbar {
        //position: fixed;
        width: 100%;
        left: 0;
        //top: 54px;
        z-index: 9;
    }

    .search-page {
        margin-top: 64px;
        .formset {
            padding: 0 !important;
        }
    }
</style>
