<script lang="ts">
    import { page } from "$app/stores";
    import FixedMovieCard from "@/components/FixedMovieCard.svelte";
    import TerraBanner from "@/components/TerraBanner.svelte";
    import TMeta from "@/components/TMeta.svelte";
    import { localApi } from "@/lib/api";
    import { SITE } from "@/lib/constants";
    import { appStore } from "@/stores/app.svelte";
    import type { IObj } from "@cmn/utils/interfaces";
    import TuLink from "@repo/ui-sv/components/TuLink.svelte";
    import { onMount, untrack } from "svelte";

    let { genres } = $derived(appStore);
    let movies = $state<IObj[]>(null),
        setMovies = (v: any) => (movies = v);

    let p = $derived($page.url.searchParams.get("p"));

    let genreName = $derived(
        genres?.movies?.filter(
            (it: any) => it.id === parseInt(`${$page.params.id}`)
        )[0]?.name
    );

    async function getMovies() {
        console.log("Getting movies....");
        setMovies(null);

        const _page = p ? p : "1";
        const { id } = $page.params;
        const url = "/movie/genre/" + id + "?page=" + _page;
        const { data } = await localApi.get(url);
        // console.log(data);
        setMovies(data.data);
    }

    $effect(() => {
        p;
        // console.log("Watch P", { _p });
        untrack(() => {
            getMovies();
        });
    });

    onMount(() => {
        // getMovies();
    });
</script>

<div class="mt-2">
    {#if genreName}
        <TMeta
            desc={`Browse through all the ${genreName} movies - ${SITE}`}
            title={`${genreName} movies - ${SITE}`}
        />
    {/if}

    <div class="mt-4 mb-4 t-c">
        <h1 class="mb-3 title">
            {#if genres?.movies}
                <span class="text-primary fs-25">{genreName}</span>
            {/if}
            <b>movies</b>
        </h1>
    </div>
    <div
        style="flex-direction: row; flex-wrap: nowrap"
        class="flex items-center w-100p overflow-x-scroll"
    >
        <div
            style="flex-direction: row; flex-wrap: nowrap"
            class="flex items-center w-100p overflow-x-scroll p-2"
        >
            {#each [...Array(50)] as it, i}
                <TuLink
                    to={$page.url.pathname + "?p=" + `${i + 1}`}
                    class={`btn p-btn btn-sm ${
                        `${i + 1}` === `${p ? p : "1"}` ? "btn-primary" : ""
                    }`}
                >
                    <span>{i + 1}</span>
                </TuLink>
            {/each}
        </div>
    </div>
    <div class="mt-4">
        <div class="m-auto flex jc-c mb-3">
            <TerraBanner num={1}/>
        </div>
        {#if movies}
            <FixedMovieCard wrap {movies} />
        {:else}
            <div>
                <div
                    style="margin-top: 20vh"
                    class="loading-div flex items-center justify-center w-100p bg-"
                >
                    <p class="fs-20"><spa class="loading loading-lg"></spa></p>
                </div>
            </div>
        {/if}
        <div class="m-auto flex jc-c my-3">
            <TerraBanner num={3}/>
        </div>
    </div>
</div>
