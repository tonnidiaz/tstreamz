<script lang="ts">
    import axios from "axios";
    import { ROOT, SITE } from "@/lib/constants";
    import TuLink from "@repo/ui-sv/components/TuLink.svelte";
    import TuPaginator from "@repo/ui-sv/components/TuPaginator.svelte";
    import CardPh from "./CardPH.svelte";
    import FixedMovieCard from "./FixedMovieCard.svelte";
    import TMeta from "./TMeta.svelte";
    import { handleErrs } from "@cmn/utils/funcs";
    import { onMount } from "svelte";
    import { localApi } from "@/lib/api";
    import ShareIcons from "./ShareIcons.svelte";
    import TerraBanner from "./TerraBanner.svelte";
    import { goto } from "$app/navigation";
    import { scrollToTheTop } from "@cmn/utils/funcs-ui";
    import { dev } from "$app/environment";

    let trending = $state<any>(null);
    let popular = $state<any>(null);
    let topRated = $state<any>(null);

    const { num, isShow }: { num: string; isShow?: boolean } = $props();

    const getData = async (url: string) => {
        try {
            let res = await localApi.get(url);
            let { data } = res.data;
            return data;
        } catch (error) {
            handleErrs(error);
            return "err";
        }
    };

    async function getAllMovies() {
        if (dev)
        console.log("GETTING ALL MOVIES...");
        scrollToTheTop()
        popular = null;
        topRated = null;
        trending = null;
        const page = num ?? 1;
        const url = isShow
            ? "/shows?t=popular&page=" + page
            : "/movies?t=popular&page=" + page;
        const data = await getData(url);
        if (data === "err") return;
        popular = data;
        const url1 = isShow
            ? "/shows?t=top&page=" + page
            : "/movies?t=top&page=" + page;
        const data1 = await getData(url1);
        if (data1 === "err") return;
        topRated = data1;
        const url2 = isShow
            ? "/shows?t=latest&page=" + page
            : "/movies?t=latest&page=" + page;
        const data2 = await getData(url2);
        if (data2 === "err") return;
        trending = data2;

        // console.log({popular: {...data}, topRated: {...data1}, trending: {...data2}})
    }

    // onMount(() => {
    //     getAllMovies();
    // });
    $effect(()=>{
        num;
        getAllMovies()
    })
</script>

<div class="styles-container">
    <TMeta
        title={`${isShow ? "TV shows " : "Movies"} - ${SITE}`}
        url={isShow ? "/shows" : "/movies"}
        desc={`Browse through all the popular, top-rated, as well as latest ${isShow ? "series" : "movies"}`}
    />

    <div class="mt-4">
        <div class="t-c">
            <ShareIcons />
        </div>

        <div
            style="flex-direction: row; flex-wrap: nowrap"
            class="os w-100p flex items-center"
        >
            <div
                style="flex-direction: row; flex-wrap: nowrap"
                class="mb-3 p-2 overflow-x-scroll w-100p flex items-center"
            >
                <!-- {#each [...Array(100)] as it, i}
                    <TuLink
                        to={`${isShow ? "/tv/" : "/movies/"}${i + 1}`}
                        class={`btn p-btn btn-sm ${num === `${i + 1}` ? "btn-primary" : ""}`}
                    >
                        {i + 1}
                    </TuLink>
                {/each} -->
                <TuPaginator total={100} page={num ? Number(num) : 1} onPrev={async p=> await goto(`${isShow ? "/tv/" : "/movies/"}${p - 1}`)} onNext={async p=> await goto(`${isShow ? "/tv/" : "/movies/"}${p + 1}`)}/>
            </div>
        </div>
        <div class="sections">
            <section>
                <h2 class="he">Top rated {isShow ? "shows" : "movies"}</h2>
                <div class="">
                    {#if topRated}
                        <FixedMovieCard
                            {isShow}
                            name="Prop"
                            movies={topRated}
                        />
                    {:else}
                        <CardPh movies={[...Array(50)]} />
                    {/if}
                </div>
            </section>
            <section>
                <h2 class="he">Trending {isShow ? "shows" : "movies"}</h2>
                <div class="">
                    {#if trending}
                        <FixedMovieCard
                            {isShow}
                            name="Prop"
                            movies={trending}
                        />
                    {:else}
                        <CardPh movies={[...Array(50)]} />
                    {/if}
                </div>
            </section>
            <TerraBanner num={3} />
            <section>
                <h2 class="he">Popular {isShow ? "shows" : "movies"}</h2>
                <div class="">
                    {#if popular}
                        <FixedMovieCard {isShow} name="Prop" movies={popular} />
                    {:else}
                        <CardPh movies={[...Array(50)]} />
                    {/if}
                </div>
            </section>
                <TerraBanner num={1}/>
            
        </div>
        <TuPaginator class="mt-4" total={100} page={num ? Number(num) : 1} onPrev={async p=> await goto(`${isShow ? "/tv/" : "/movies/"}${p - 1}`)} onNext={async p=> await goto(`${isShow ? "/tv/" : "/movies/"}${p + 1}`)}/>
    </div>
</div>

