<script lang="ts">
    import { dev } from "$app/environment";
    let { num = 1 }: { num?: 1 | 2 | 3 } = $props();
</script>

<div style="margin: auto">
    {#if dev}
        <span>TerraBanner</span>
    {/if}

   </div>
