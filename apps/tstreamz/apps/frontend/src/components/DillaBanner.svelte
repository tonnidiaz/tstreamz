<template>
  <div class=" p-2 br-4">
    <iframe
    title="nnerbFrame"
      bind:this={frame}
      width="100%"
      src="/site/dillabanner"
      frameborder="0"
      loading="lazy"
    ></iframe>
  </div>
</template>
<script lang="ts">
    import { onMount } from "svelte";

let frame: HTMLIFrameElement;
function iframeLoaded(frame: HTMLIFrameElement) {
    if (frame) {
        // here you can make the height, I delete it first, then I make it again
        
        const fh = frame?.contentWindow?.document?.body?.scrollHeight + "px";
        if (fh !== frame.height) {
        
      frame.height = "";
      frame.height = fh;
    }
  }}

onMount(()=>{
    if (frame)
    setInterval((_) => iframeLoaded(frame), 400);
})


</script>