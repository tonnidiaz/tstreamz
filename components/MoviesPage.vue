<template>
    <div class="styles-container">
      <TMeta
        :title="`${isShow ? 'TV shows ' : 'Movies'} - TunedStreamz`"
        :url="root + isShow ? '/shows' : '/movies'"
      />
  
      <div class="mt-4">
        <div class="t-c">
          <ShareIcons />
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
              :to="`${isShow ? '/tv/' : '/movies/'}${i + 1}`"
              :class="`btn p-btn btn-sm ${num === `${i + 1}` ? 'active' : ''}`"
              v-for="(it, i) in [...Array(100)]"
            >
              {{ i + 1 }}
            </NuxtLink>
          </div>
        </div>
  
        <section>
          <h2 class="mb-2 he">Top rated {{ isShow ? "shows" : "movies" }}</h2>
          <div class="">
            <FixedMovieCard
              v-if="topRated"
              :isShow="isShow"
              name="Prop"
              :movies="topRated"
            />
            <CardPH v-else :movies="[...Array(50)]" />
          </div>
        </section>
        <section>
          <h2 class="mb-2 he">Trending {{ isShow ? "shows" : "movies" }}</h2>
          <div class="">
            <FixedMovieCard
              v-if="trending"
              :isShow="isShow"
              name="Prop"
              :movies="trending"
            />
            <CardPH v-else :movies="[...Array(50)]" />
          </div>
        </section>
        <div class="mt-2">
          <TerraBanner />
        </div>
        <section>
          <h2 class="mb-2 he">Popular {{ isShow ? "shows" : "movies" }}</h2>
          <div class="">
            <FixedMovieCard
              v-if="popular"
              :isShow="isShow"
              name="Prop"
              :movies="popular"
            />
            <CardPH v-else :movies="[...Array(50)]" />
          </div>
        </section>
      </div>
    </div>
  </template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { root } from "@/utils/constants";
const name = ref("Movies");
const trending = ref<any>(null);
const setTrending = (val: any) => {
  trending.value = val;
};
const popular = ref<any>(null);
const setPopular = (val: any) => {
  popular.value = val;
};
const topRated = ref<any>(null);
const setTopRated = (val: any) => {
  topRated.value = val;
};

const getData = async (url : string) => {
  try {
    let res = await axios.get(url);
    let { data } = res.data;
    return data;
  } catch (error) {
    console.log(error);
    return "err";
  }
};

async function getAllMovies() {
      setPopular(null);
      setTopRated(null);
      setTrending(null);
      const { isShow, num } = props;
      const page = num ?? 1;
      const url = isShow
        ? "/api/shows?t=popular&page=" + page
        : "/api/movies?t=popular&page=" + page;
      const data = await getData(url);
      if (data === "err") return;
      setPopular(data);
      const url1 = isShow
        ? "/api/shows?t=top&page=" + page
        : "/api/movies?t=top&page=" + page;
      const data1 = await getData(url1);
      if (data1 === "err") return;
      setTopRated(data1);
      const url2 = isShow
        ? "/api/shows?t=latest&page=" + page
        : "/api/movies?t=latest&page=" + page;
      const data2 = await getData(url2);
      if (data2 === "err") return;
      setTrending(data2);
    }
const props = defineProps({
    num: String,
    isShow: Boolean
})

onBeforeMount(()=>{
    getAllMovies()
})
</script>