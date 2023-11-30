<template>
  <div class=" p-2 br-4">
    <iframe
      ref="frame"
      width="100%"
      src="/site/dillabanner"
      frameborder="0"
      loading="lazy"
    ></iframe>
  </div>
</template>
<script setup lang="ts">
const frame = ref()
function iframeLoaded(frame) {
    if (frame) {
        // here you can make the height, I delete it first, then I make it again
        
        const fh = frame?.contentWindow?.document?.body?.scrollHeight + "px";
        if (fh !== frame.height) {
        
      frame.height = "";
      frame.height = fh;
    }
  }}

onMounted(()=>{
    if (frame)
    setInterval((_) => iframeLoaded(frame), 400);
})


</script>