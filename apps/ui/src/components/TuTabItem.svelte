<script lang="ts">
    import type { Snippet } from "svelte";

    interface IProps {
        tab: number;
        i: number;
        label: Snippet;
        content: Snippet;
    }
    let { tab = $bindable(), i, content, label }: IProps = $props();
</script>

<a href="#" role="tab" class={`tab ${tab == i && 'tab-active'}`} onclick={_=> tab = i}>{@render label()}</a>
{#if tab == i}
    <div class="tu-tab-content">
        {@render content()}
    </div>
{/if}
