<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import TuModalContainer from "./TuModalContainer.svelte";
    import TuTeleport from "./TuTeleport.svelte";

    let id = $state("");
    let { open = $bindable(false), content, toggler, class: _class }: { open?: boolean; content?: Snippet; toggler?: Snippet; class?: string } = $props();

    onMount(() => {
        id = `modal-${Date.now()}`;
    });
</script>

<div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <label
        for={id}
        onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            open = true;
        }}
    >
        {@render toggler?.()}
    </label>

    <!-- Put this part before </body> tag -->
    <TuTeleport to="#ctx-overlay">
        <div class={`modal modal-md flex-col flex items-center justify-center ${open ? "modal-open" : ""}`}>
            <TuModalContainer bind:open={open} blank>
                {#if open}
                   <div class={"modal-box min-w-400 " + _class}>
                    {@render content?.()}
                </div> 
                {/if}
                
            </TuModalContainer>

            <label class="modal-backdrop" for={id}>Close</label>
        </div></TuTeleport
    >
    <input class="checkbox hidden" type="checkbox" />
</div>
