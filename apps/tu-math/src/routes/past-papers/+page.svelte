<script lang="ts">
    import { api } from "@/lib/api";
    import type { IParsedPastPaper } from "@/lib/interfaces";
    import { handleErrs, isTuError } from "@cmn/utils/funcs";
    import TuLink from "@repo/ui-sv/components/TuLink.svelte";
    import TuSelect from "@repo/ui-sv/components/TuSelect.svelte";
    import UAccordion from "@repo/ui-sv/components/UAccordion.svelte";
    import UButton from "@repo/ui-sv/components/UButton.svelte";
    import UDivider from "@repo/ui-sv/components/UDivider.svelte";
    import { showToast } from "@repo/ui-sv/lib/funcs";

    import { onMount } from "svelte";

    let year = $state("2024");
    let years = $state<string[]>();
    let pastPapers = $state<IParsedPastPaper[]>();

    const fetchPastPaperYears = async () => {
        try {
            const { data } = await api.get("/past-papers?yo=true");
            years = data;
        } catch (err) {
            handleErrs(err);
            showToast({
                msg: isTuError(err) || "Failed to fetch past papers",
                err: true,
            });
        }
    };
    const fetchPastPaperData = async (year: string) => {
        try {
            console.log("Fetching papers for", year);
            pastPapers = null
            const {data} = await api.get("/past-papers", {params: {year}})
            pastPapers = data
        } catch (err) {
            pastPapers = []
            handleErrs(err);
            showToast({
                msg: isTuError(err) || "Failed to fetch past papers",
                err: true,
            });
        }
    };
    onMount(() => {
        fetchPastPaperYears();
    });

    $effect(()=>{
        year;
        fetchPastPaperData(year)
    })
</script>

<div class="p-4 w-full">
    <div class="p-4 w-500px border-1 border-card rounded-md m-auto">
        <div class="mb-2 flex items-center justify-between gap-2 w-full">
            <h1>Past papers</h1>
            <TuSelect
                class="min-w-100px"
                placeholder="Select year"
                innerHint="year"
                bind:value={year}
                options={(years || []).map((el) => ({ label: el, value: el }))}
            ></TuSelect>
        </div>
        <UDivider />
        <div class="mt-3">
            {#if pastPapers?.length}
                {#each pastPapers[0].subjects as pastPaper}
                    <UAccordion class="br-0">
                        {#snippet label()}

                            <h4 class="fs-13 fw-6">{pastPaper.subject}</h4>    
                        {/snippet}
                        {#snippet content()}
                            <div class="grid grid-cols-2 gap-3">
                                {#each pastPaper.papers as paper}
                                    <div>
                                       <h5 class="fs-13 fw-5">{paper.date}</h5>
                                    <div class="mt-4 flex flex-col gap-1 flex-wrap">
                                        {#each paper.docs as doc, docIndex}
                                            <div class="p-2 border-1 border-card rounded-md flex flex-wrap gap-2">
                                                <TuLink to={`/past-papers/${pastPaper._id}/${paper.date}/${docIndex + 1}/paper`} class="btn-sm btn btn-secondary btn-outline">{doc.paper.name}</TuLink>
                                                {#if doc.memo.name}
                                                <TuLink to={`/past-papers/${pastPaper._id}/${paper.date}/${docIndex + 1}/memo`} class="btn-sm btn btn-secondary btn-outline">{doc.memo.name}</TuLink>
                                                {/if}
                                            </div>
                                        {/each}
                                    </div> 
                                    </div>
                                    
                                {/each}
                            </div>
                        {/snippet}
                    </UAccordion>
                {/each}
            {:else}
                <div class="loading-div">
                    {#if pastPapers?.length == 0}
                        <h3>No data</h3>
                    {:else}
                        <span class="loading loading-waves"></span>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>
