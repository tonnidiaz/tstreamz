<script lang="ts">
    import { page } from "$app/stores";
    import DillaBanner from "@/components/DillaBanner.svelte";
    import FixedMovieCard from "@/components/FixedMovieCard.svelte";
    import TerraBanner from "@/components/TerraBanner.svelte";
    import TMeta from "@/components/TMeta.svelte";
    import TrailerBtn from "@/components/TrailerBtn.svelte";
    import WatchlistBtn from "@/components/WatchlistBtn.svelte";
    import { localApi } from "@/lib/api";

    import { imgUrl, ROOT, SITE } from "@/lib/constants";
    import { preventScroll } from "@/lib/funcs";
    import { handleErrs } from "@cmn/utils/funcs";
    import type { IObj } from "@cmn/utils/interfaces";
    import TuLink from "@repo/ui/components/TuLink.svelte";
    import { onMount, untrack } from "svelte";

    let meta = $state<any>(null),
        setMeta = (v: any) => (meta = v);
    let server = $state(0),
        setServer = (v: number) => (server = v);
    let tv = $state<IObj | null>(null);
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
        const url = ROOT + `/tv/${id}?s=${s}`;

        setEpsReady(false);
        try {
            const { data } = await localApi.get(url);
            const episodes = data.data;
            return episodes;
        } catch (e) {
            handleErrs(e);
            setEpsReady(true);
            throw e; /* createError({
        statusCode: 500,
        message: "Error fetching episodes"
    }) */
        }
    };

    const getMeta = async (id: any) => {
        const url = `/meta/tv/${id}`;

        const { data } = await localApi.get(url);
        const { meta } = data;
        return meta;
    };

    const setupEps = async (s: any) => {
        // When season changes
        try {
            const eps = await getEps(id, s);
            setEpisodes(eps);
            setCurrEp(eps.episodes[0]);
            setEpsReady(true);
        } catch (e) {
            console.log(e);
        }
    };

    $effect(() => {
        // Watch episodes
        const val = episodes;
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
            s = s ?? "1";
            ep = ep ?? "1";
            setSNum(s);
            setENum(ep);
            if (episodes.episodes) {
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
        const val = sNum;
        untrack(() => {
            setupEps(val);
        });
    });

    onMount(() => {
        // When show changes
        scrollToTheTop();

        setupMeta();
        setSNum(null);
        if (tv.value) {
            let { s, ep } = query;
            s = s ?? "1";
            ep = ep ?? "1";
            setSNum(s);
            setENum(ep);
        }
    });
</script>

<div class="h-100p">
    <div style="height: 5px" class="the-top"></div>
    <div class="mt-13 relative h-100p">
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
                    <div class="title-cont d-none">
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
                            src={embedUrls(server)}
                        ></iframe>
                    </div>

                    <div class="mt-14 d-flex-md sandes br-10 p-3">
                        <div
                            style="flex-shrink: 0"
                            class="m-auto w-225 h-280 pos-rel"
                        >
                            <img
                                alt="Movie  banner"
                                loading="lazy"
                                class="br-4"
                                width="100%"
                                height="auto"
                                src={imgUrl + tv?.poster_path}
                            />
                        </div>

                        <div class="movie-info mt-4">
                            <h1 class="title">{tv?.name}</h1>
                            <div class="mt-2">
                                <div class="d-flex ai-center">
                                    <TrailerBtn isShow id={tv?.id} />
                                    &nbsp; &nbsp;
                                    <span class="rating color-yellow">
                                        <span>
                                            <i class="fas fa-star"></i>
                                        </span>
                                        {tv?.vote_average}
                                    </span>
                                    &nbsp; &nbsp;
                                    <WatchlistBtn item={tv} isShow />
                                </div>
                                <p class="plot mt-3">{tv?.overview}</p>
                            </div>
                            {#if meta}
                                <div
                                    style="textoverflow: ellipsis; overflow: hidden"
                                    class="meta row"
                                >
                                    <ul class="col-md-7 col-lg-6">
                                        <li>
                                            <p>
                                                <b>Genre(s): </b>
                                                {#if tv?.genres}
                                                    {#each tv?.genres as it, i}
                                                        <span>
                                                            {#if i !== tv?.genres.length - 1}
                                                                <span
                                                                    ><TuLink
                                                                        class="link"
                                                                        to={`/tv/genre/${it.id}`}
                                                                    >
                                                                        {it.name}
                                                                    </TuLink>
                                                                    &nbsp; | &nbsp;</span
                                                                >
                                                            {:else}
                                                                <TuLink
                                                                    class="link"
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
                                                <b>Date: </b>
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
                                                <b>Status: </b>
                                                {tv?.status}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <b>Language(s): </b>
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
                                <div class="mt-4w-100p h-200">
                                    <div class="w-100p h-100p">
                                        <h3 class="text-center">Loading...</h3>
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
                    <div
                        class="mt-13 sandes br-10 p-2 flex mb-3"
                        style="margin: 0"
                    >
                        {#if epsReady}
                            <div>
                                {#if currEp}
                                    <div>
                                        <h5>
                                            S{sNum}Ep{eNum}: &nbsp;{currEp.name}
                                        </h5>
                                        <div class="mt-2 mb-2">
                                            <p>Date: {currEp.air_date}</p>
                                        </div>
                                        <p>
                                            {currEp.overview}
                                        </p>
                                    </div>
                                {:else}
                                    <div class="loading-div">
                                        <p class="fs-20">No data!</p>
                                    </div>
                                {/if}
                            </div>
                        {:else}
                            <div class="skel w-100p h-150">
                                <h5 class="skel-text">Episode name</h5>
                                <div class="mt-2 mb-2">
                                    <p class="skel-text">Date: 0000-00-00</p>
                                </div>
                                <p class="skel-text">
                                    Lorem ipsum dolor, sit amet consectetur
                                    adipisicing elit.
                                </p>
                                <p class="skel-text">
                                    Lorem ipsum dolor, sit amet consectetur
                                    adipisicing elit.
                                </p>
                                <p class="skel-text">
                                    Lorem ipsum dolor, sit amet consectetur
                                    adipisicing elit.
                                </p>
                                <p class="skel-text">
                                    Lorem ipsum dolor, sit amet consectetur
                                    adipisicing elit.
                                </p>
                            </div>
                        {/if}
                    </div>
                    <div
                        class="mt-13 sandes br-10 row mb-3 pd-5 pdb-10"
                        style="margin: 0"
                    >
                        <div class="col-md-4">
                            <fieldset
                                class="p-4 w-100p fieldset border-card no-el"
                            >
                                <legend>Seasons</legend>

                                <div class="mt-2 row">
                                    {#each tv?.seasons as season, i}
                                        <TuLink
                                            class={`col m-1 btn btn-sm btn-outline-dark ${
                                                `${sNum}` === `${i + 1}`
                                                    ? "active"
                                                    : ""
                                            }`}
                                            to={`/watch/tv/${tv?.id}?s=${i + 1}&ep=1`}
                                            >Season {i + 1}</TuLink
                                        >
                                    {/each}
                                </div>
                            </fieldset>
                        </div>
                        <div class="col-md-8">
                            <fieldset class="p-4 fieldset no-el border-card">
                                <legend class="">Episodes</legend>
                                <div class="mt-2 row">
                                    {#if episodes}
                                        {#each episodes?.episodes as ep, i}
                                            <TuLink
                                                title={ep.name}
                                                class={`col-md-3 m-1 w-nowrap btn btn-sm btn-outline-dark  ${
                                                    eNum ===
                                                    `${ep.episode_number}`
                                                        ? "active"
                                                        : ""
                                                }`}
                                                to={`/watch/tv/${tv?.id}?s=${ep.season_number}&amp;ep=${ep.episode_number}`}
                                            >
                                                Episode {i + 1} :
                                                {ep.name}</TuLink
                                            >
                                        {/each}
                                    {:else}
                                        <div class="loading-div">
                                            <span>Loading Episodes...</span>
                                        </div>
                                    {/if}
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    <div class="mt-14">
                        <TerraBanner />
                    </div>
                    <div class="mt-14">
                        <h3 class="he">Similar Shows</h3>
                        <div style="padding-left: 15px" class="mt-13 os d-flex">
                            {#if meta}
                                <FixedMovieCard movies={meta.similar} isShow />
                            {:else}
                                <div class="loading-div">
                                    <h5>Loading...</h5>
                                </div>
                            {/if}
                        </div>
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
