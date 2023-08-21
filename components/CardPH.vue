<template>
  <div class="_row no-wrap ai-center">
    <div :key="i" v-for="(it, i) in movies" class="fmc fshr-0 p-0 oh">
      <div class="movie-card fixed h-100p bg-card oh">
        <div class="w-100p h-100p pos-rel dflex ai-center jc-center">
                <div class="fs-30 color-orange loading blinky"><i class="far fa-popcorn"></i></div>
                <div class="fs-12 fw-6 color-white-2">Loading...</div>
                
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps({
    movies: {
        type: Array
    }
})
</script>
