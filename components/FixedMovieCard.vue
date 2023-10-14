<template>
  <div :class="classes">
    <div :key="i" v-for="(it, i) in movies" :title="isShow ? it.name : it.title" class="fmc fshr-0 p-0 oh">
      <div class="movie-card fixed h-100p bg-card ">
        <div class="w-100p h-130 pos-rel">
          <div
            :style="`background-size: cover`"
            class="br-4 pos-rel w-100p h-100p"
          >
            <img alt="image" class='br-4' loading="lazy" :src="imgUrl + it.poster_path" />
          </div>
          <div class="info dflex jc-center pos-abs w-100p h-100p">
            <NuxtLink
              class="playBtn btn-none"
              :to="`/watch/${isShow ? 'tv' : 'm'}/${it.id}`"
              ><i class="fal fa-play-circle"></i
            ></NuxtLink>
          </div>
        </div>
        <div class="oh " style="padding: 0px">
        <div>
          <div class="d-flex jc-sb ai-center">
            <NuxtLink
              class="fs-13 w-nowrap"
              :to="`/watch/${isShow ? 'tv' : 'm'}/${it.id}`"
              ><h3 class="fs-14 color-white w-nowrap">
                {{ isShow ? it.name : it.title }}
              </h3></NuxtLink
            >
            <WatchlistBtn :isShow="isShow" :item="it" />
          </div>
          <div class="d-flex fs-12 jc-sb">
            <div>
              <span><i class="fal fa-calendar"></i></span>&nbsp;{{
                isShow
                  ? it?.first_air_date?.split("-")[0]
                  : it?.release_date?.split("-")[0]
              }}
            </div>
            <div>
              <span class="color-yellow"
                ><i class="fas fa-star"></i>&nbsp;{{ it.vote_average }}</span
              >
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { imgUrl } from "@/utils/constants";
const classes = ref(""), cardClasses = ref("");
const props  = defineProps({
    name: {
        type: String
    },
    movies: {
        type: Array<any>
    },
    wrap: Boolean,
    isShow: {
        type: Boolean
    }
})

watch(()=> props.wrap, v=>{
    console.log(v);
    classes.value = v ? "row ai-center jc-center" : "_row no-wrap ai-center";
    cardClasses.value = v ? "row ai-center" : "_row no-wrap ai-center";

}, {deep: true, immediate: true})
</script>
