<template>
    <div>
    <TMeta
      v-if="star"
      :title="'Discover movies with ' + star?.name + ' - TunedStreamz'"
      :desc="`Discover some of the best movies with ${star?.name}.`"
      :url="root + `/discover/star/${star?.id}`"
      :src="imgUrl + star?.profile_path"
    />

    
    <div v-if="movies"><section>
      <h3 class="text-center">
        Movies with <span class="color-orange">{{ star?.name }}</span>
      </h3>
    </section>
    <section v-if="movies" style="margin-top: -20" class="">
      <div >
        <FixedMovieCard :movies="movies" :wrap="true" />
      </div>
    </section></div>

    <div
      @touchmove="(e) => e.preventDefault()"
      @wheel="(e) => e.preventDefault()"
      v-else
      class="d-flex ai-center jc-center loda"
    >
      <p class="fs-40"><b>Loading....</b></p>
    </div>
  </div>
</template>
<script setup lang="ts">

import { ref, onBeforeMount } from "vue";
import {imgUrl, root} from '@/utils/constants'

const route = useRoute();
  const id = ref(route.params.id);
  const movies = ref<[any]>(), star = ref<any>();

const { data, error} = await useFetch<any>('/api/discover/star/' + id.value, {
    watch: [id]
})
if (error.value) {
  throw createError({ statusCode: error.value?.statusCode, statusMessage: error.value.statusMessage });
}
movies.value = data.value.data.movies
star.value = data.value.data.star

</script> 
