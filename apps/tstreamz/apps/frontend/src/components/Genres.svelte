<script lang="ts">
    import { appStore as _appStore } from "@/stores/app.svelte";
    import TuLink from "@repo/ui-sv/components/TuLink.svelte";
    import UAccordion from "@repo/ui-sv/components/UAccordion.svelte";
    import UDivider from "@repo/ui-sv/components/UDivider.svelte";

    let { genres } = $derived(_appStore);
</script>

{#if genres}
    <div class="max-h-400 flex flex-col gap-1 bg-card pd-3 m-auto">
        <h2 class="fw-6 text-white fs-20 mb-3">Genres</h2>
        <UAccordion>
            {#snippet label()}
                <h3 class="fw-6 fs-18 text-white">Movies</h3>
            {/snippet}
            {#snippet content()}
                <!-- <UDivider class="mt-2"/> -->
                <ul class="movies list gap-4 pl-2">
                    {#each genres?.movies as it, i}
                        <li>
                            <TuLink
                                class="nav-link"
                                to={`/movies/genre/${it.id}`}
                                ><span class="fw-7 text-white">
                                    <!-- &#9675; -->
                                </span>{it.name}</TuLink
                            >
                        </li>
                    {/each}
                </ul>
            {/snippet}
        </UAccordion>

        <UAccordion>
            {#snippet label()}
                <h3 class="fw-6 fs-18 text-white">Shows</h3>
            {/snippet}
            {#snippet content()}
                <!-- <UDivider class="mt-2"/> -->
                <ul class="movies list gap-4 pl-2">
                {#each genres?.shows as it, i}
                    <li>
                        <TuLink class="nav-link" to={`/tv/genre/${it.id}`}
                            ><span class="fw-7 text-white">
                                <!-- &#9675; -->
                            </span>{it.name}</TuLink
                        >
                    </li>
                {/each}
            </ul>
            {/snippet}
        </UAccordion>

    </div>
{/if}

<style lang="scss">
    .movies {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>
