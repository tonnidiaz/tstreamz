<script lang="ts">
    import { isValidDate } from "@cmn/utils/funcs";
    import type { IObj } from "@cmn/utils/interfaces";
    import TuLink from "@repo/ui-sv/components/TuLink.svelte";
    import type { HTMLAttributes } from "svelte/elements";

    interface IProps extends HTMLAttributes<any> {
        name?: string;
        videos?: IObj[];
        wrap?: boolean;
    }

    const {
        name,
        videos,
        wrap,
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

    const classes = "movie-card h-100p bg-card w-100p";
</script>

<div
    class={`${wrap ? "row items-center justify-center wrap" : "flex no-wrap items-center overflow-x-scroll"} ${_class} gap-2`}
    {...props}
>
    {#if !videos?.length}
        {#each [...Array(5)] as it}
            <div class="{wrap && 'wrap'} fmc flex items-center justify-center ">
                <div class={classes + ` flex items-center justify-center`}>
                    {#if !videos}
                    <span class="loading loading-bars loading-md"></span>
                    {:else}
                    <span class="fs-30"><i class="fi fi-rr-sad-tear"></i></span>
                    {/if}
                </div>
            </div>
        {/each}
    {:else}
        {#each [...videos] as it, i}
            <div title={it.title} class="{wrap && 'wrap'} fmc fshr-0 p-0 oh">
                <div class={classes}>
                    <div class="w-100p pos-rel">
                        <div
                            style="background-size: cover"
                            class="pos-rel img-cont border-1 border-card rounded-full"
                        >
                            <img
                                alt="video art"
                                class="w-100p rounded-full"
                                loading="lazy"
                                src={it.thumb}
                            />
                        </div>
                        <div
                            class="info flex items-center justify-center pos-abs w-100p h-100p"
                        >
                            <TuLink
                                class="playBtn btn-none fs-30"
                                to={`/watch/${it._id}`}
                                ><i class="fi fi-rr-play"></i></TuLink
                            >
                        </div>
                    </div>
                    <div class="oh text-center flex flex-col items-center w-100p" style="padding: 0px">
                            <div class="w-full">
                                <TuLink
                                    class="fs-13 wp-nowrap text-ellipsis"
                                    to={`/watch/${it._id}`}
                                    ><h3
                                        class="fs-14 text-white wp-nowrap text-ellipsis"
                                    >
                                        {it.title}
                                    </h3></TuLink
                                >
                                <!-- <WatchlistBtn {isShow} item={it} /> -->
                            </div>
                            {#if it.date?.length && isValidDate(it.date)}
                            <div class="flex fs-12 justify-between">
                                <div class="text-secondary">
                                    <span><i class="fi fi-br-calendar"></i></span
                                    >&nbsp;{new Date(it.date + " 13:00").toISOString().split("T")[0]}
                                </div>
                                <div>
                                    <!-- <span class="color-yellow"
                                        ><i class="fi fi-ss-star"
                                        ></i>&nbsp;{Number(
                                            it.vote_average
                                        ).toFixed(1)}</span
                                    > -->
                                </div>
                            </div>
                            {/if}
                    </div>
                </div>
            </div>
        {/each}
    {/if}
</div>

<style lang="scss">

    $card-w: 180px;
    .fmc{
        width: $card-w !important;
        height: 230px !important;
        *{box-sizing: border-box;}
        .img-cont{
            width: calc($card-w - 15px);
            height: calc($card-w - 15px);
            margin: auto;
        }
        img{
            object-fit: contain;
        }

        .movie-card{
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 4px
        }
    }

    @media screen and (max-width: 404px){
        .fmc.wrap{
            width: 100% !important;
        }
    }
</style>