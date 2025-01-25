<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    import TuLink from "./TuLink.svelte";
    import { onMount } from "svelte";

    let ref: HTMLLIElement | undefined = $state()
    interface IProps extends HTMLAttributes<any> {
        to?: string;
        title?: string;
        innerClass?: string;
        icon?: string;
        reload?: boolean
    }
    const {
        to,
        innerClass,
        children,
        title,
        icon,
        reload,
        class: _class,
        onclick,
        ...props
    }: IProps = $props();

    $effect(()=>{
        // console.log({onclick});
        onclick;
        ref.onclick = onclick
    })

</script>

<li bind:this={ref} class={"tooltip tooltip-right tu-menu-item " + _class} data-tip={title} {...props}>
    {#if to}
        <TuLink {reload} {to} class={`${innerClass}`}>
            {#if icon}
                <i class={icon}></i>
            {/if}
            {@render children?.()}
        </TuLink>
    {:else}
        <span class={`${innerClass}`}>
            {#if icon}
                <i class={icon}></i>
            {/if}
            {@render children?.()}
        </span>
    {/if}
</li>
