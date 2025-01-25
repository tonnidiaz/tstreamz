<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    import TuLink from "./TuLink.svelte";
    import { onMount } from "svelte";

    let ref: HTMLLIElement | undefined = $state();
    interface IProps extends HTMLAttributes<any> {
        to?: string;
        title?: string;
        innerClass?: string;
        icon?: string;
        reload?: boolean;
        loading?: boolean;
        disabled?: boolean;
    }
    let {
        to,
        innerClass,
        children,
        title,
        icon,
        reload,
        class: _class,
        onclick,
        loading = $bindable(),
        disabled,
        ...props
    }: IProps = $props();

    $effect(() => {
        // console.log({onclick});
        onclick;
        ref.onclick = async (e) => {
            loading = true;
            try {
                await onclick(e);
            } catch (err) {
                console.log(err);
            } finally {
                loading = false;
            }
        };
    });
</script>

<li
    bind:this={ref}
    class={`tooltip tooltip-right tu-menu-item ${(loading || disabled) && "disabled"} ` +
        _class}
    data-tip={title}
    {...props}
>
    {#if to}
        <TuLink {reload} {to} class={`flex items-center gap-2 ${innerClass}`}>
            {#if icon}
                <i class={icon}></i>
            {/if}
            <div class="flex-1">
                {@render children?.()}
            </div>
            {#if loading}
                <span class="loading loading-sm loading-ring"></span>
            {/if}
        </TuLink>
    {:else}
        <span class={`flex items-center gap-2 ${innerClass}`}>
            {#if icon}
                <i class={icon}></i>
            {/if}
            <div class="flex-1">
                {@render children?.()}
            </div>
            {#if loading}
                <span class="loading loading-sm loading-ring"></span>
            {/if}
        </span>
    {/if}
</li>
