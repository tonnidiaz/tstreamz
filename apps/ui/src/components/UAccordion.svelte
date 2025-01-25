<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLDetailsAttributes } from "svelte/elements";

    interface IProps extends HTMLDetailsAttributes {
        label?: Snippet;
        content?: Snippet;
        multiple?: boolean;
    }
    const {
        label,
        content,
        class: _class,
        multiple,
        ...props
    }: IProps = $props();
</script>

<details
    class={"collapse collapse-arrow border border-card  collapse-sm hdn " +
        _class}
    {...props}
>
    <summary class="collapse-title text-l font-medium w-full">
        {@render label?.()}
    </summary>
    <div class="collapse-content w-full">
        {@render content?.()}
    </div>
</details>

<style>
</style>
