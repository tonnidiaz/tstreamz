<template>
    <div class="mt-2">
      <TMeta
        desc="Browse through movies by genre | TunedStreamz"
        v-if="
          genres?.movies?.filter((it: any) => it.id === parseInt(`${$route.params.id}`))[0]
            ?.name
        "
        :title="`${
          genres?.movies?.filter((it: any) => it.id === parseInt(`${$route.params.id}`))[0]
            ?.name
        } Movies - TunedStreamz`"
      />
  
      <div class="mt-4 mb-4 t-c">
   
        <h1 class="mb-3">
<span  class="color-orange fs-25" v-if="genres?.movies">{{
            genres?.movies?.filter(
              (it: any) => it.id === parseInt(`${$route.params.id}`)
            )[0]?.name
          }}</span>          <b>movies</b>
        </h1>

        <div v-if="!genres?.movies" class="skel">
          <h2 class="fs-10 skel-text">genre grenre genre</h2>
        </div>
      </div>
      <div
        style="flex-direction: row; flex-wrap: nowrap"
        class="os w-100p dflex ai-center"
      >
        <div
          style="flex-direction: row; flex-wrap: nowrap"
          class="os w-100p dflex ai-center"
        >
          <NuxtLink
            :key="i"
            :to="$route.path + '?p=' + `${i + 1}`"
            v-for="(it, i) in [...Array(50)]"
            :class="`btn p-btn btn-sm ${
              `${i + 1}` === `${$route.query.p ? $route.query.p : '1'}`
                ? 'active'
                : ''
            }`"
          >
            <span>{{ i + 1 }}</span>
          </NuxtLink>
        </div>
      </div>
      <div class="">
        <FixedMovieCard :wrap="true" v-if="movies" :movies="movies" />
        <div v-else class="mt-4">
          <div style="margin-top: 20vh" class="loading-div">
            <p class="fs-20">Please wait...</p>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import axios from "axios";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";
import { ref } from "vue";
const appStore = useAppStore()


const { genres} = storeToRefs(appStore)
const movies = ref<any>(null),
  setMovies = (v: any) => (movies.value = v);


  const route = useRoute();

  async function getMovies() {

    console.log("Getting movies....");
      setMovies(null);
      const page = route.query.p ? route.query.p : "1";
      const { id } = route.params;
      const url = "/api/movie/genre/" + id + "?page=" + page;
      const { data } = await axios.get(url);
        console.log(data);
      setMovies(data.data);
    }

    watch(()=> route.query, (val)=>{
        getMovies();
    })

    onMounted(()=>{
        getMovies()
    })
</script>