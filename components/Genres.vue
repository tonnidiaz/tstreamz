<template>
    <div  class="genres">
      <section>
        <h3 class="color-white-2">Movies</h3>
        <hr/>
        <ul class="movies">
          <li :key="i" v-for="(it, i) in appStore.genres?.movies" v-if="appStore.genres">
            <NuxtLink class="nav-link" :to="`/movies/genre/${it.id}`">{{
              it.name
            }}</NuxtLink>
          </li>
        </ul> 
      </section>
      <section>
        <h3 class="color-white-2">TV Shows</h3>
        <hr/>
        <ul class="movies">
          <li :key="i" v-for="(it, i)  in appStore.genres?.shows" v-if="appStore.genres">
            <NuxtLink class="nav-link" :to="`/tv/genre/${it.id}`">{{
              it.name
            }}</NuxtLink>
          </li>
        </ul>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
import { useAppStore } from '@/stores/app';

  const appStore = useAppStore()
  </script>
  