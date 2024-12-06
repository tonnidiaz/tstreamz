<script lang="ts">
    import type { IObj } from "@cmn/utils/interfaces";
    import type { HTMLAttributes } from "svelte/elements";

    interface IProps extends HTMLAttributes<any> {
        movies: IObj[];
    }
    const { movies, class: _class, ...props }: IProps = $props();
</script>

<div class={"flex no-wrap items-center gap-2 " + _class || ""} {...props}>
    {#each movies as it, i}
        <div class="fmc fshr-0 p-0 oh">
            <div class="movie-card  h-100p bg-card oh">
                <div class="w-100p h-100p pos-rel flex flex-col gap-2 items-center justify-center">
                    <div class="fs-30 color-orange loading blinky">
                        <i class="far fa-popcorn"></i>
                    </div>
                    <div class="fs-12 fw-6 color-gray-100">&nbsp;&nbsp;Loading...</div>
                </div>
            </div>
        </div>
    {/each}
</div>
