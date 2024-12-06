<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import UForm from "@repo/ui/components/UForm.svelte";
    import UInput from "@repo/ui/components/UInput.svelte";

    function handleSubmit(e: any) {
        e.preventDefault();
        const inp = e.currentTarget["search"];

        goto("/search?q=" + inp.value);
    }

    let { value } = $props();
</script>

    <UForm onsubmit={handleSubmit} class="home-form m-auto" action="#">
        <div class="form-group flex ai-center pos-rel m-auto">
            <UInput
                {value}
                placeholder="Enter movie or tv show title"
                name="search"
                type="search"
                class="custom-padding m-auto"
            >
                {#snippet trailing()}
                    <button
                        class="btn-none"
                        type="submit"
                        aria-label="Search button"
                        ><i class="fi fi-rr-search"></i></button
                    >
                {/snippet}
            </UInput>
        </div>
    </UForm>
