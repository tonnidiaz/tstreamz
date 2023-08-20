<template name="component-name">
    <div v-if="movie.poster_path" class="my-20 card search-res">
      <div class="d-flex">
        <div class="cover mr-2 pos-rel">
          <NuxtLink
            :to="isShow ? '/watch/tv/' + movie.id : '/watch/m/' + movie.id"
            class="ttl"
          >
            <img alt="Banner" loading="lazy" :src="imgUrl + movie.poster_path" />
          </NuxtLink>
        </div>
        <div class="w-100p">
         
            <NuxtLink
              :to="isShow ? '/watch/tv/' + movie.id : '/watch/m/' + movie.id"
              class="ttl"
            > <h2 class="fs-16 w-100p text-white">
              {{ isShow ? movie.name : movie.title }}</h2></NuxtLink
            >
          
  
          <div class="d-flex ai-center">
            <NuxtLink to="" class="fs-14">
              {{ isShow ? movie.first_air_date : movie.release_date }}
            </NuxtLink>
            &nbsp; &bull; &nbsp;
            <NuxtLink to="" class="fs-14">{{ movie.original_language }}</NuxtLink>
          </div>
  
          <div class="ai-center d-flex jc-sb">
            <TrailerBtn :id="movie.id" :isShow="isShow" class='bg-orange'/>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span class="color-yellow fs-13">
              <i class="fas fa-star"></i>&nbsp;{{ movie.vote_average }}
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <WatchlistBtn :item="movie" :isShow="isShow" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { imgUrl } from "@/utils/constants";
  
  defineProps({
    movie: {
        type: Object, required: true},
        
    isShow: Boolean
  })
  </script>
  