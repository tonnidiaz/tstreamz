<script>
    import Carousel from "@repo/ui/components/Carousel.svelte";


    import TuCarousel from "@repo/ui/components/TuCarousel.svelte";
    import { onMount } from "svelte";
onMount(()=>{
    console.log("RF MOUNTED");
})
</script>

<div class="p-4">
    <div class="bg-base-200 p-2 mb-2">
      <h1 class="my-4 ttl">Research Facility</h1>  
    </div>
    
    <div class="pos-rel p-2 bg-">
        <TuCarousel>
            <div class="carousel-item">
                <div class=" fs-30 fw-7 text-white p-4 border-1 border-card bg-primary text-center flex justify-center w-200px">1</div></div>
            <div class="carousel-item">
                <div class=" fs-30 fw-7 text-white p-4 border-1 border-card bg-secondary text-center flex justify-center">2</div></div>
            <div class="carousel-item">
                <div class=" fs-30 fw-7 text-white p-4 border-1 border-card bg-red-500 text-center flex justify-center">3</div></div>
        </TuCarousel> 
    </div>
    <h1 class="my-4 ttl">Research Facility</h1>  
</div>
