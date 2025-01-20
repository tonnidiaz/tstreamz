<script lang="ts">
    import { onMount } from "svelte";
    import * as mathlive from "mathlive";

 
    let mfe: mathlive.MathfieldElement | undefined;
    let formula = $state(`\\frac{\\left(x^2+5\\right)}{4}`)
    onMount(() => {
        mfe.applyStyle({
            fontFamily: "monospace",
            backgroundColor: "red"
        });
    });

    function getLatex() {
        console.log(mfe.getValue());
    }
</script>

<div class="p-2 relative my-2 bg-">
    <div class="border-1 w-full border-card input input-borderd math-field">
       <math-field
        bind:this={mfe}
        id="formula"
        class="w-full"
     >{formula}</math-field> 
    </div>
    
</div>
<div class="p-4 border-1 border-card br-4" id="math-container"></div>

<button on:click={getLatex}>Get LaTeX</button>
