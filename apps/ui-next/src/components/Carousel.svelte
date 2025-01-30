<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
  
    let currentIndex = $state(0);
    let intervalId;
    let isHovering = false;
  
    const slides = [
      { image: '/images/slide1.jpg', title: 'Slide 1' },
      { image: '/images/slide2.jpg', title: 'Slide 2' },
      { image: '/images/slide3.jpg', title: 'Slide 3' }
    ];
  
    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
    };
  
    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    };
  
    const startInterval = () => {
      intervalId = setInterval(nextSlide, 3000); // Change interval time as needed
    };
  
    const stopInterval = () => {
      clearInterval(intervalId);
    };
  
    onMount(() => {
    //   startInterval();
    });
  
    onDestroy(() => {
      stopInterval();
    });
  
    // $: {
    //   if (isHovering) {
    //     stopInterval();
    //   } else {
    //     startInterval();
    //   }
    // }
  </script>
<h2>{currentIndex}</h2>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="carousel" onmouseenter={() => isHovering = true} onmouseleave={() => isHovering = false}>
    <div class="carousel-inner" style={`transform: translateX(-${currentIndex * 100}%)`}>
      {#each slides as slide}
        <div class="slide" style={`background-image: url(${slide.image})`}>
          <h2>{slide.title}</h2>
        </div>
      {/each}
    </div>
  
    <div class="controls">
      <button class="control-button" onclick={prevSlide}>&#10094;</button>
      <button class="control-button" onclick={nextSlide}>&#10095;</button>
    </div>
  </div>

  <style>
    .carousel {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
  
    .carousel-inner {
        width: 100%;
      display: flex;
      transition: transform 0.5s ease-in-out;
    }
  
    .slide {
      flex: 0 0 100%; 
      text-align: center;
      background-size: cover;
      background-position: center;
      height: 300px; /* Adjust height as needed */
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    .slide img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  
    .slide h2 {
      /* position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%); */
      color: white;
      text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
  
    .controls {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  
    .control-button {
      background: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 10px 20px;
      border: none;
      cursor: pointer;
    }
  </style>
  