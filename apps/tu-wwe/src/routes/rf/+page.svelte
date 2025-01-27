<script>

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
            <div class="carousel-item">1</div>
            <div class="carousel-item">2</div>
            <div class="carousel-item">3</div>
        </TuCarousel> 
    </div>
    <h1 class="my-4 ttl">Research Facility</h1>  
</div>
