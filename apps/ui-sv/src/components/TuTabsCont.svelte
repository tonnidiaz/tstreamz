<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";

    let {children} : HTMLAttributes<any> = $props()
</script>

<div role="tablist" class="tabs tabs-bordered tab-labels">
    {@render children()}
</div>