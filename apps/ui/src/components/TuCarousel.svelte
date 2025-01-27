<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount, untrack } from "svelte";
    import { type HTMLAttributes } from "svelte/elements";

    interface IProps extends HTMLAttributes<any>{
        duration?: number
    }

    let { children, duration = 3000,...props } : IProps = $props();
    let items: Element[] = $state([])

    let currentIndex = $state(0);
    let interval; //
    let carousel: HTMLDivElement | undefined = $state();



    const next = () => {
        currentIndex = (currentIndex + 1) % items.length;
    };

    const prev = () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
    };

    const startAutoSlide = () => {
        // interval = setInterval(next, duration);
    };

    const stopAutoSlide = () => {
        clearInterval(interval);
    };

    $effect(()=>{
        children;
        carousel;

        if(carousel){
            untrack(()=>{

                items = [...carousel.querySelectorAll(".carousel-item")]
            })
            
        }
    })
    onMount(() => {
        startAutoSlide();
        return stopAutoSlide;
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div bind:this={carousel} class="carousel" onmouseover={stopAutoSlide} onmouseout={startAutoSlide}>
    <div
        class="carousel-inner"
        style={`--current-index: ${currentIndex}`}
    >
        {@render children?.()}
    </div>

    <div class="controls">
        <button onclick={prev}>&lt;</button>
        <button onclick={next}>&gt;</button>
    </div>
</div>

<style>
    
  </style>
  