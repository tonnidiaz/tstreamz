<script lang="ts">
    import { imgUrl } from "@/lib/constants";
    import type { IObj } from "@cmn/utils/interfaces";
    import TuLink from "@repo/ui/components/TuLink.svelte";
    import { untrack } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";
    import WatchlistBtn from "./WatchlistBtn.svelte";

    interface IProps extends HTMLAttributes<any> {
        name?: string;
        movies: IObj[];
        wrap?: boolean;
        isShow?: boolean;
    }

    const {
        name,
        movies,
        wrap,
        isShow,
        class: _class,
        ...props
    }: IProps = $props();

    // $effect(() => {
    //     // watch wrap
    //     const v = wrap;
    //     untrack(() => {
    //         // classes = ;
    //         // cardClasses = v ? "row items-center" : "flex no-wrap items-center";
    //     });
    // });

    const classes = "movie-card h-100p bg-card w-100p"
</script><div class={`${wrap ? "row items-center justify-center wrap" : "flex no-wrap items-center"} ${_class} gap-2 overflow-x-scroll`} {...props}>
{#if !movies?.length}
{#each [...Array(5)] as it}
    <div class={"fmc flex items-center justify-center "}>
        <div class={classes + ` flex items-center justify-center`}><span class="fs-30"><i class="fi fi-rr-sad-tear"></i></span></div>
    
</div>
{/each}

{:else}
    
    {#each movies as it, i}
        <div title={isShow ? it.name : it.title} class="fmc fshr-0 p-0 oh">
            <div class={classes}>
                <div class="w-100p h-130px pos-rel">
                    <div
                        style="background-size: cover"
                        class="br-4 pos-rel w-100p h-100p"
                    >
                        <img
                            alt="movie cover"
                            class="br-4 w-100p"
                            loading="lazy"
                            src={imgUrl + it.poster_path}
                        />
                    </div>
                    <div class="info flex items-center justify-center pos-abs w-100p h-100p">
                        <TuLink
                            class="playBtn btn-none fs-30"
                            to={`/watch/${isShow ? "tv" : "m"}/${it.id}`}
                            ><i class="fi fi-rr-play"></i></TuLink
                        >
                    </div>
                </div>
                <div class="oh" style="padding: 0px">
                    <div>
                        <div class="flex justify-between items-center">
                            <TuLink
                                class="fs-13 wp-nowrap text-ellipsis"
                                to={`/watch/${isShow ? "tv" : "m"}/${it.id}`}
                                ><h3 class="fs-14 text-white wp-nowrap text-ellipsis">
                                    {isShow ? it.name : it.title}
                                </h3></TuLink
                            >
                            <WatchlistBtn {isShow} item={it} />
                        </div>
                        <div class="flex fs-12 justify-between">
                            <div>
                                <span><i class="fal fa-calendar"></i></span
                                >&nbsp;{isShow
                                    ? it?.first_air_date?.split("-")[0]
                                    : it?.release_date?.split("-")[0]}
                            </div>
                            <div>
                                <span class="color-yellow"
                                    ><i class="fi fi-ss-star"
                                    ></i>&nbsp;{Number(it.vote_average).toFixed(1)}</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/each}


{/if}
</div>