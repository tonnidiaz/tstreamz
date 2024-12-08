<script lang="ts">
    import { onMount } from "svelte";
    import type { HTMLFormAttributes } from "svelte/elements";

    interface IProps extends HTMLFormAttributes {
        state?: any;
    }
    let formRef = $state<HTMLFormElement>()
    let { children, onsubmit, ...props }: IProps = $props();
    const _onSubmit = async (e: any) => {
        console.log("TuForm: onSubmit");
        e.preventDefault();
        const btns = [...e.target.querySelectorAll("button[type=submit]")];
        btns.forEach((btn: any) => {
            btn.disabled = true;
        });
        await onsubmit?.(e);
        btns.forEach((btn: any) => (btn.disabled = false));
    };
    onMount(()=>{
        // console.log('TuForm mounted');
        // console.log(formRef, onsubmit);
        formRef.addEventListener('submit', _onSubmit)
        return ()=> formRef.removeEventListener('submit', _onSubmit)
    })
</script>

<form  {...props} bind:this={formRef}>
    {@render children?.()}
</form>
