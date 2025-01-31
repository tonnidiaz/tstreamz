<script>
    import { parseDate } from "@cmn/utils/funcs";
    import UAccordion from "@repo/ui-sv/components/UAccordion.svelte";
    import UButton from "@repo/ui-sv/components/UButton.svelte";
    import UFormGroup from "@repo/ui-sv/components/UFormGroup.svelte";
    import UInput from "@repo/ui-sv/components/UInput.svelte";
    

</script>
<div class="p-4 flex flex-col gap-4">
    <h1>Welcome to SvelteKit {parseDate()}</h1>
<UButton>Hello world</UButton>
<UFormGroup label="Username">
    <UInput placeholder="Enter username..."/>
</UFormGroup>
<UAccordion>
    {#snippet label()}
        <h2>Accordion</h2>
    {/snippet}
</UAccordion>
<p>
    Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
    documentation
</p>

</div>
