<script lang="ts">
    import {type HTMLAttributes } from "svelte/elements";

    interface IProps extends HTMLAttributes<any>{}
    let {children} : IProps = $props()
</script>
<div class="w-full fixed z-[1000] h-full bg-base-100 flex items-center justify-center tu-loader">
    {#if children}
        {@render children()}
    {:else}
    <div class="loading loading-lg"></div>
    {/if}
</div>
<style>
    .tu-loader{
        top: 0;
        left: 0;

    }
</style>