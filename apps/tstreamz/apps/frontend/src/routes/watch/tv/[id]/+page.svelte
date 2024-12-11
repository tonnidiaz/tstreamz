<script lang="ts">
    import { dev } from "$app/environment";
    import { page } from "$app/stores";
    import DillaBanner from "@/components/DillaBanner.svelte";
    import FixedMovieCard from "@/components/FixedMovieCard.svelte";
    import MovieArt from "@/components/MovieArt.svelte";
    import TerraBanner from "@/components/TerraBanner.svelte";
    import TMeta from "@/components/TMeta.svelte";
    import TrailerBtn from "@/components/TrailerBtn.svelte";
    import WatchlistBtn from "@/components/WatchlistBtn.svelte";
    import { localApi } from "@/lib/api";

    import { imgUrl, ROOT, showFrame, SITE } from "@/lib/constants";
    import { preventScroll } from "@/lib/funcs";
    import { handleErrs } from "@cmn/utils/funcs";
    import type { IObj } from "@cmn/utils/interfaces";
    import TuLink from "@repo/ui/components/TuLink.svelte";
    import UAccordion from "@repo/ui/components/UAccordion.svelte";
    import { onMount, untrack } from "svelte";

    let { data } = $props();
    let meta = $state<any>(null),
        setMeta = (v: any) => (meta = v);
    let server = $state(0),
        setServer = (v: number) => (server = v);
    let tv = $derived<IObj | null>(data.tv);
    let frame: HTMLIFrameElement;

    let episodes = $state<any>(null),
        setEpisodes = (v: any) => (episodes = v);
    let epsReady = $state<any>(null),
        setEpsReady = (v: any) => (epsReady = v);
    let currEp = $state<any>(null),
        setCurrEp = (v: any) => (currEp = v);
    let sNum = $state<any>(null),
        setSNum = (v: any) => (sNum = v);

    let eNum = $state<any>(null),
        setENum = (v: any) => (eNum = v);

    let id = $derived($page.params.id);

    const servers = () => {
        const movieId = id;
        const s = query.s ?? "1",
            e = query.ep ?? "1";
        return [`https://www.2embed.cc/embedtv/${movieId}&s=${s}&e=${e}`];
    };
    const embedUrls = (i: number = 3) => {
        return servers()[i];
    };

    const getEps = async (id: any, s: string) => {
        console.log("Getting episodes...", id);
        const url = `/tv/${id}?s=${s}`;

        setEpsReady(false);
        try {
            setEpisodes(null);
            const r = await localApi.get(url);
            const episodes = r.data;
            // console.log({episodes});
            if (typeof episodes == "object") return episodes;
        } catch (e) {
            handleErrs(e);
            setEpsReady(true);
        }
    };

    const getMeta = async (id: any) => {
        const url = `/meta/tv/${id}`;
        console.log("Getting metadata...", id);
        try {
            setMeta(null);
            const { data } = await localApi.get(url);
            const { meta } = data;
            // console.log({meta});
            return meta;
        } catch (e) {
            handleErrs(e);
        }
    };

    const setupEps = async (s: any) => {
        // When season changes
        try {
            const eps = await getEps($page.params.id, s);
            if (eps) {
                setEpisodes(eps);
                setCurrEp(eps.episodes[0]);
            }
            setEpsReady(true);
        } catch (e) {
            handleErrs(e);
        }
    };
    onMount(() => {});

    $effect(() => {
        // Watch episodes
        const val = episodes;
        if (!val) return;
        untrack(() => {
            const { ep } = Object.fromEntries($page.url.searchParams);
            const e = ep ?? "1";
            const i = parseInt(`${e}`) - 1;
            if (val.episodes) setCurrEp(val.episodes[i]);
            setEpsReady(true);
        });
    });

    const scrollToTheTop = () => {
        const _top = document.querySelector(".the-top");
        _top?.scrollIntoView({ behavior: "smooth" });
    };

    let query = $derived(Object.fromEntries($page.url.searchParams));

    $effect(() => {
        // watch rpute.query
        const v = query;
        untrack(() => {
            scrollToTheTop();

            let { s, ep } = v;
            s = s || "1";
            ep = ep || "1";
            setSNum(s);
            setENum(ep);
            if (episodes?.episodes) {
                setCurrEp(episodes.episodes[parseInt(`${ep}`) - 1]);
            } else {
                setCurrEp(null);
            }
        });
    });

    const setupMeta = async () => {
        const mta = await getMeta(id);
        setMeta(mta);
    };

    $effect(() => {
        if (dev) console.log({ tv: tv?.name });
    });

    $effect(() => {
        id;
        // When show changes
        untrack(() => {
            scrollToTheTop();
            setupMeta();
            setSNum(null);
            // if (tv.value) {
                let { s, ep } = query;
                s = s ?? "1";
                ep = ep ?? "1";
                setSNum(s);
                setENum(ep);
            // }
        });
    });
    $effect(() => {
        const val = sNum;
        id;
        untrack(() => {
            setupEps(val);
        });
    });
</script>

<div class="h-100p">
    <div style="height: 5px" class="the-top"></div>
    <div class="mt-1 relative h-100p">
        {#if tv}
            <TMeta
                url={ROOT + `/watch/tv/${tv?.id}`}
                keywords={`TunedBass, TunedStreamz, ${tv?.title}, Watch ${tv?.title} TunedStreamz`}
                src={imgUrl + tv?.poster_path}
                desc={tv?.overview}
                title={`Watch ${tv?.name} - ${SITE}`}
            />
        {/if}
        <div class="relative h-100p">
            {#if tv}
                <div>
                    <div class="title-cont d-none hidden">
                        <h1 class="fs-16 t-c fw-7">
                            You're watching
                            <span class="color-orange">{tv.name}</span>
                        </h1>
                    </div>
                    {#if false}
                        <select
                            bind:value={server}
                            name="server"
                            id="server"
                            class="form-control w-150 my-5"
                        >
                            {#each servers() as server, i}
                                <option value={i}>
                                    Server {i + 1}
                                </option>
                            {/each}
                        </select>
                    {/if}

                    <div
                        class="mb-4 video-frame d-flex ai-center jc-center sandes br-10"
                    >
                        <iframe
                            title="Tunedtreamz frame"
                            bind:this={frame}
                            width="100%"
                            height={500}
                            allowFullScreen
                            frameborder="0"
                            src={showFrame ? embedUrls(server) : ""}
                        ></iframe>
                    </div>

                    <div class="md:flex md:gap-3 sandes br-10 p-3">
                        <MovieArt img={tv?.poster_path} />

                        <div class="movie-info mt-4">
                            <h1 class="title">{tv?.name}</h1>
                            <div class="mt-2">
                                <div class="flex items-center">
                                    <TrailerBtn isShow id={tv?.id} />
                                    &nbsp; &nbsp;
                                    <span class="rating color-yellow">
                                        <span>
                                            <i class="fi fi-ss-star"></i>
                                        </span>
                                        {tv?.vote_average}
                                    </span>
                                    &nbsp; &nbsp;
                                    <WatchlistBtn item={tv} isShow />
                                </div>
                                <p class="plot mt-3">{tv?.overview}</p>
                            </div>
                            {#if tv}
                                <div
                                    style="textoverflow: ellipsis; overflow: hidden"
                                    class="mt-2 meta grid sm:grid-cols-2 gap-2"
                                >
                                    <ul class="fs-14">
                                        <li>
                                            <p>
                                                <span class="key"
                                                    >Genre(s):
                                                </span>
                                                {#if tv?.genres}
                                                    {#each tv?.genres as it, i}
                                                        <span>
                                                            {#if i !== tv?.genres.length - 1}
                                                                <span
                                                                    ><TuLink
                                                                        class="text-secondary"
                                                                        to={`/tv/genre/${it.id}`}
                                                                    >
                                                                        {it.name}
                                                                    </TuLink>
                                                                    &nbsp; | &nbsp;</span
                                                                >
                                                            {:else}
                                                                <TuLink
                                                                    class="text-secondary"
                                                                    to={`/tv/genre/${it.id}`}
                                                                >
                                                                    {it.name}
                                                                </TuLink>
                                                            {/if}
                                                        </span>
                                                    {/each}
                                                {/if}
                                            </p>
                                        </li>

                                        <li>
                                            <p>
                                                <span class="key">Date: </span>
                                                {tv?.first_air_date.split(
                                                    "-"
                                                )[0]} -
                                                {tv?.last_air_date.split(
                                                    "-"
                                                )[0]}
                                            </p>
                                        </li>
                                    </ul>
                                    <ul class="col-md-7 col-lg-6">
                                        <li>
                                            <p>
                                                <span class="key"
                                                    >Status:
                                                </span>
                                                {tv?.status}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <span class="key"
                                                    >Language(s):
                                                </span>
                                                {#each tv?.spoken_languages as it, i}
                                                    <span>
                                                        {#if i !== tv?.spoken_languages.length - 1}
                                                            <span
                                                                >{it.name}&nbsp;&#x2022;&nbsp;</span
                                                            >
                                                        {:else}
                                                            <span
                                                                >{it.name}</span
                                                            >
                                                        {/if}
                                                    </span>
                                                {/each}
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            {:else}
                                <div class="mt-4 w-100p">
                                    <div class="w-100p h-100p _row jc-center">
                                        <span
                                            class="loading loading-bars loading-md"
                                        ></span>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                    <!-- 103 -->
                    <div class="mt-4">
                        <!--AD-->
                        <TerraBanner />
                    </div>
                    <!-- 167 -->
                    <div class="mt- sandes br-10 pd-4 flex mb-2">
                        {#if epsReady}
                            {#if episodes}
                                <div class="w-100p">
                                    {#if currEp}
                                        <div>
                                            <h5 class="fs-18 text-white">
                                                S{sNum}Ep{eNum}: &nbsp;{currEp.name}
                                            </h5>
                                            <div class="mt-2 mb-2">
                                                <p>
                                                    <span class="key"
                                                        >Date:</span
                                                    >
                                                    <span
                                                        class="text-secondary"
                                                    >
                                                        {currEp.air_date}</span
                                                    >
                                                </p>
                                            </div>
                                            <p>
                                                {currEp.overview}
                                            </p>
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
                                </div>
                            {:else}
                                <div class="loading-div w-100p h-100p m-0">
                                    <span class="fs-30 flex ai-center mt-4">
                                        <i class="fi fi-rr-sad-tear"></i>
                                    </span>
                                </div>
                            {/if}
                        {:else}
                            <div class="loading-div">
                                <span class="loading loading-lg loading-bars"
                                ></span>
                            </div>
                        {/if}
                    </div>
                    <div
                        class="mt-13 sandes br-10 grid md:grid-cols-3 gap-2 mb-3 pd-5 pdb-10"
                        style="margin: 0"
                    >
                        <div class="md:col-span-1">
                            <UAccordion>
                                {#snippet label()}
                                    <h4 class="fw-6 text-white">
                                        {tv.seasons.length} Seasons
                                    </h4>
                                {/snippet}
                                {#snippet content()}
                                    <div class="mt-2 flex wrap jistify-center">
                                        {#each tv?.seasons as season, i}
                                            <TuLink
                                                class={`col m-1 btn btn-sm btn-outline btn-neutral ${
                                                    `${sNum}` === `${i + 1}`
                                                        ? "text-secondary"
                                                        : ""
                                                }`}
                                                to={`/watch/tv/${tv?.id}?s=${i + 1}&ep=1`}
                                                >Season {i + 1}</TuLink
                                            >
                                        {/each}
                                    </div>
                                {/snippet}
                            </UAccordion>
                        </div>
                        <div class="md:col-span-2">
                            <UAccordion>
                                {#snippet label()}
                                    <h4 class="fw-6 text-white">
                                        {episodes?.episodes?.length} Episodes
                                    </h4>
                                {/snippet}
                                {#snippet content()}
                                    <div class="flex wrap">
                                        {#if epsReady}
                                            {#if episodes}
                                                {#each episodes?.episodes as ep, i}
                                                    <TuLink
                                                        title={ep.name}
                                                        class={`col-md-3 m-1 w-nowrap btn btn-sm btn-outline btn-neutral  ${
                                                            eNum ===
                                                            `${ep.episode_number}`
                                                                ? "text-secondary"
                                                                : ""
                                                        }`}
                                                        to={`/watch/tv/${tv?.id}?s=${ep.season_number}&ep=${ep.episode_number}`}
                                                    >
                                                        Episode {i + 1} :
                                                        {ep.name}</TuLink
                                                    >
                                                {/each}
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
                                        {:else}
                                            <div class="loading-div">
                                                <span
                                                    class="loading loading-bars"
                                                ></span>
                                            </div>
                                        {/if}
                                    </div>
                                {/snippet}
                            </UAccordion>
                        </div>
                    </div>

                    <div class="m-auto flex jc-c mt-3">
                        <TerraBanner num={3}/>
                    </div>
                    <div class="mt-4">
                        <h3 class="he">Similar Shows</h3>
                        <div style="padding-left: 15px" class="mt-13 os d-flex">
                            {#if meta}
                                <FixedMovieCard movies={meta.similar} isShow />
                            {:else}
                                <div class="loading-div">
                                    <span
                                        class="loading loading-lg loading-bars"
                                    ></span>
                                </div>
                            {/if}
                        </div>
                    </div>
                    <div class="m-auto flex jc-c mt-3">
                        <TerraBanner num={1}/>
                    </div>
                </div>
            {:else}
                <div
                    ontouchmove={preventScroll}
                    onwheel={preventScroll}
                    class="flex items-center justify-center loda"
                >
                    <p class="fs-40">
                        <b><span class="loading loading-lg"></span></b>
                    </p>
                </div>
            {/if}
        </div>
    </div>
</div>
