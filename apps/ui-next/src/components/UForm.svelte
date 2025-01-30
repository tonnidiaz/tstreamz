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
        // console.log({e});
        // const btns = [...e.target.querySelectorAll("button[type=submit]")];
        // const btn: HTMLButtonElement = btns[0]
            // btn.onclick = async ()=> await onsubmit?.(e)
        // btn.classList.add('btn-loading')
        await onsubmit?.(e);
        // btn.classList.remove('btn-loading')
        // btns.forEach((btn: any) => (btn.disabled = false));
    };
    $effect(()=>{
        // console.log('TuForm mounted');
        // console.log(formRef, onsubmit);
        formRef;
        // formRef.addEventListener('submit', _onSubmit)
        formRef.onsubmit = _onSubmit
        // return ()=> formRef.removeEventListener('submit', _onSubmit)
    })
</script>

<form method="POST"  {...props} bind:this={formRef}>
    {@render children?.()}
</form>
