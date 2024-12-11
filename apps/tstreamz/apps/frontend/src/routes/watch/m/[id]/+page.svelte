<script lang="ts">
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
    import { onMount, untrack } from "svelte";

    let meta = $state<any>(null),
        setMeta = (v: any) => (meta = v);
    let server = $state(0),
        setServer = (v: number) => (server = v);
    // let movie = $state<IObj | null>(null);
    let frame: HTMLIFrameElement;
    let id = $derived($page.params.id);

    const {data} = $props();
    let movie = $derived<IObj | undefined>(data.movie)

    const servers = () => [`https://www.2embed.cc/embed/${id}`];
    const embedUrls = (i: number = 0) => {
        const movieId = movie?.id;
        return true ? servers()[i] : "";
    };

    const getMeta = async (id: any) => {
        console.log("Getting meta...");
        try {
            const url = `/meta/m/${id}`;
            console.log({id});
            setMeta(undefined)
            const { data } = await localApi.get(url);
            const { meta } = data;
            // console.log({meta});
            setMeta(meta);
        } catch (e) {
            handleErrs(e);
            setMeta({});
        }
    };

    const scrollToTheTop = () => {
        
        const _top = document.querySelector(".the-top");
        _top?.scrollIntoView({ behavior: "smooth" });
    };
  
    
    $effect(()=>{
        console.log({id});
        scrollToTheTop();
        untrack(()=>{
             getMeta(id);
        })
       
    })
</script>

<div class="h-100p">
    <div style="height: 5px" class="the-top"></div>
    <div class="mt-1 relative h-100p">
        {#if movie}
            <TMeta
                url={ROOT + `/watch/m/${movie?.id}`}
                keywords={`TunedBass, TunedStreamz, ${movie?.title}, Watch ${movie?.title} TunedStreamz`}
                src={imgUrl + movie?.poster_path}
                desc={movie?.overview}
                title={`Watch ${movie?.title} - ${SITE}`}
            />
        {/if}
        <div class="relative h-100p">
            {#if movie}
                <div>
                    <div class="title-cont d-none hidden">
                        <h1 class="fs-16 text-center fw-7">
                            You're watching
                            <span class="color-orange">{movie.title}</span>
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
                        class="mb-4 video-frame flex ai-center jc-center sandes br-10"
                    >
                        <iframe
                            title="Tunedtreamz frame"
                            bind:this={frame}
                            width="100%"
                            height={500}
                            allowFullScreen
                            
                            frameborder="0"
                            src={!showFrame ? '' : embedUrls(server)}
                        ></iframe>
                    </div>

                    <div class=" md:flex md:gap-3 sandes br-10 p-3 justify-start">
                      
                            <MovieArt
                                img={movie?.poster_path}
                            />

                        <div class="movie-info mt-4">
                            <h1 class="title">{movie?.title}</h1>
                            <div class="mt-2">
                                <div class="flex items-center">
                                    <TrailerBtn id={movie?.id} />
                                    &nbsp; &nbsp;
                                    <span class="rating color-yellow">
                                        <span>
                                            <i class="fi fi-ss-star"></i>
                                        </span>
                                        {movie?.vote_average}
                                    </span>
                                    &nbsp; &nbsp;
                                    <WatchlistBtn item={movie} />
                                </div>
                                <p class="plot mt-3">{movie?.overview}</p>
                            </div>
                            {#if meta}
                                <div
                                    style="textoverflow: ellipsis; overflow: hidden"
                                    class="mt-2 meta grid sm:grid-cols-2 gap-2"
                                >
                                    <ul class="fs-14 ">
                                        {#if meta?.credits?.cast}
                                        <li>
                                            <p>
                                                <span class="key">Cast: </span>
                                                
                                                    {#each meta.credits.cast.slice(0, 5) as it, i}
                                                        <span>
                                                            {#if i !== meta.credits.cast.slice(0, 5).length - 1}
                                                                <span
                                                                    ><TuLink
                                                                        class="text-secondary"
                                                                        to={`/discover/star/${it.id}`}
                                                                    >
                                                                        {it.name}
                                                                    </TuLink>
                                                                    &nbsp; | &nbsp;</span
                                                                >
                                                            {:else}
                                                                <TuLink
                                                                    class="text-secondary"
                                                                    to={`/discover/star/${it.id}`}
                                                                >
                                                                    {it.name}
                                                                </TuLink>
                                                            {/if}
                                                        </span>
                                                    {/each}
                                                
                                            </p>
                                        </li>
                                        {/if}
                                        <li>
                                            <p>
                                               <span class="key">Genre(s):</span> 
                                                {#if movie?.genres}
                                                    {#each movie?.genres as it, i}
                                                        <span>
                                                            {#if i !== movie?.genres.length - 1}
                                                                <span
                                                                    ><TuLink
                                                                        class="text-secondary"
                                                                        to={`/movies/genre/${it.id}`}
                                                                    >
                                                                        {it.name}
                                                                    </TuLink>
                                                                    &nbsp; | &nbsp;</span
                                                                >
                                                            {:else}
                                                                <TuLink
                                                                    class="text-secondary"
                                                                    to={`/movies/genre/${it.id}`}
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
                                                <span class="key">Language: </span>
                                                {movie?.original_language}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <span class="key">Released: </span>
                                                {movie?.release_date}
                                            </p>
                                        </li>
                                    </ul>
                                    <ul class="col-md-7 col-lg-6">
                                        <li>
                                            <p>
                                                <span class="key">Duration: </span>
                                                {movie?.runtime}m
                                            </p>
                                        </li>
                                        <li></li>
                                        <li>
                                            <p>
                                                <span class="key">Status: </span>
                                                {movie?.status}
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            {:else}
                                <div class="mt-4 w-100p">
                                    <div class="w-100p h-100p _row jc-center">
                                        <span class="loading loading-bars loading-md"></span>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                    <div class="m-auto flex jc-c my-3">
                        <TerraBanner num={3}/>
                    </div>
                    {#if !meta || meta?.similar?.length}
                        <section class="mt-1">
                        <h3 class="he">Similar Movies</h3>
                        <div class="mt-3 flex overflow-x-scroll">
                            {#if meta}
                                <FixedMovieCard
                                    movies={meta.similar ? meta.similar : []}
                                />
                            {:else}
                                <div class="loading-div">
                                    <p>
                                        <span class="loading loading-lg loading-bars"></span>
                                    </p>
                                </div>
                            {/if}
                        </div>
                    </section> 
                    {/if}
                   
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

<style lang="scss">
    
</style>