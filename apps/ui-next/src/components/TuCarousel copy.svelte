<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount, untrack } from "svelte";
    import { type HTMLAttributes } from "svelte/elements";

    interface IProps extends HTMLAttributes<any>{
        duration?: number, offset?: number
    }

    let { children, duration = 20, offset = $bindable(0),...props } : IProps = $props();
    let carousel: HTMLDivElement | undefined = $state();
    let itemWidth = 300

    let currentIndex = $state(0), totalWidth = $state(0);
    let interval; // For auto-sliding
    const items = [
        { id: 1, content: "Item 1" },
        { id: 2, content: "Item 2" },
        { id: 3, content: "Item 3" },
    ];


    const next = () => {
        const items = [...carousel.querySelectorAll('.carousel-item')];
    const value = offset
      const currentOffset = value % totalWidth;
      const currentIndex = items.findIndex((item, index) => {
        const cumulativeWidth = items
          .slice(0, index + 1)
          .reduce((total, i) => total + i.clientWidth, 0);
        return cumulativeWidth > -currentOffset;
      });

      const nextIndex = (currentIndex + 1) % items.length;
      offset = value - items[nextIndex].clientWidth;

  };

  const prev = () => {
    const items = [...carousel.querySelectorAll('.carousel-item')];
    const value = offset
      const currentOffset = value % totalWidth;
      const currentIndex = items.findIndex((item, index) => {
        const cumulativeWidth = items
          .slice(0, index + 1)
          .reduce((total, i) => total + i.clientWidth, 0);
        return cumulativeWidth > -currentOffset;
      });

      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      offset = value + items[prevIndex].clientWidth;

  };

    const startAutoSlide = () => {
        interval = setInterval(next, duration);
    };

    const stopAutoSlide = () => {
        clearInterval(interval);
    };

    // onMount(() => {
    //     startAutoSlide();
    //     return stopAutoSlide;
    // });
    const startMarquee = () => {
    interval = setInterval(() => {
    //   offset = (offset - 1) % (items.length * itemWidth)
    }, duration);
  };

  const stopMarquee = () => {
    clearInterval(interval);
  };

  $effect(()=>{
    carousel;
    if (carousel){
        const items = carousel.querySelectorAll('.carousel-item');
        let w = 0
        for (let it of items){
            w += it.clientWidth
        }

        untrack(()=>{totalWidth = w})
    }
  })
  onMount(() => {
    startMarquee();
    return stopMarquee;
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div bind:this={carousel} class="carousel" onmouseover={stopMarquee} onmouseout={startMarquee}>
    <div
        
        class="carousel-inner"
        style={`transform: translateX(${offset}px); transition: transform 0s linear;`}
    >
        {#each items as item}
            <div class="carousel-item">{item.content}</div>
        {/each}
    </div>

   
</div>
 <div class="controls mt-4">
        <button onclick={prev}>&lt;</button>
        <button onclick={next}>&gt;</button>
    </div>
<style>
    .carousel {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      overflow: hidden;
      width: 100%;
      max-width: 600px;
      height: 4rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      background: repeating-linear-gradient(45deg, #1a202c, #2d3748 20px, #4a5568 40px);
    }
  
    .carousel-inner {
      display: flex;
      flex-wrap: nowrap;
      white-space: nowrap;
      transition: transform 0s linear;
    }
  
    .carousel-item {
      flex: 0 0 auto;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: bold;
      color: #fff;
      text-align: center;
      padding: 0 1rem;
    }
  
    .carousel:hover .carousel-item {
      filter: brightness(1.2);
    }
  
    .controls {
      /* position: absolute; */
      top: 50%;
      width: 100%;
      display: flex;
      justify-content: space-between;
      /* transform: translateY(-50%); */
    }
  
    .controls button {
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.3s;
    }
  
    .controls button:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  </style>
