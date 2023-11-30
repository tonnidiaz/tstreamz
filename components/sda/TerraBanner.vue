<template>
    <div class=" p-2 br-4">
      <iframe
      title=""
        ref="frame"
        width="100%"
        src="/site/terrabanner"
        frameborder="0"
        loading="lazy"
      ></iframe>
    </div>
  </template>
  <script>
  function iframeLoaded(frame) {
    if (frame) {
      // here you can make the height, I delete it first, then I make it again
  
      const fh = frame?.contentWindow?.document?.body?.scrollHeight + "px";
      if (fh !== frame.height) {
        frame.height = "";
        frame.height = fh;
      }
    }
  }
  export default {
    mounted() {
      const { frame } = this.$refs;
      frame && setInterval((_) => iframeLoaded(frame), 400);
    },
  };
  </script>