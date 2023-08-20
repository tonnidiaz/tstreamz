<template>
  <div class="_row no-wrap ai-center">
    <div :key="i" v-for="(it, i) in movies" class="fmc fshr-0 p-0 oh">
      <div class="movie-card fixed h-100p bg-card oh">
        <div class="w-100p h-100p pos-rel dflex ai-center jc-center">
            <div>Loading...</div>
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
