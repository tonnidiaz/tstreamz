<template>
    <div class="body">
      <TMeta title="My Watchlist - TunedStreamz" />
  
      <div v-if="appStore.ready">
      <div v-if="!appStore.user" class="centered-children">
          <div  class="form">
          <div
            class="p-4 t-c w-100p h-100p br-4 sandes d-flex ai-center jc-center"
          >
            <h1 class="fs-20">
              Create and account to add movies to watchlist.
              <NuxtLink class="fs-18 color-orange link" to="/auth/login?red=/me/watchlist"
                >Login</NuxtLink
              >
            </h1>
          </div>
        </div>
      </div>
        
  
        <div v-else>
          <div class="mt-14">
            <h1>
              <b>My Watchlist</b>
            </h1>
            <hr />
            <section class="m-3">
              <h2>Movies</h2>
              <div class="mt-4 p-2 mb-4 d-flex os">
                <div v-if="appStore.watchlist?.movies">
                  <FixedMovieCard
                    v-if="appStore.watchlist.movies.length"
                    :movies="[...appStore.watchlist.movies].reverse()"
                  />
                  <div v-else class="loading-div">
                    <h5>No content</h5>
                  </div>
                </div>
                <div v-else>
                  <div class="loading-div">
                    <h5>No content</h5>
                  </div>
                </div>
              </div>
            </section>
            <section class="m-3 mt-4">
              <h2>TV Shows</h2>
              <div class="mt-4 p-2 d-flex os">
                <div v-if="appStore.watchlist?.shows">
                  <FixedMovieCard
                    :isShow="true"
                    v-if="appStore.watchlist.shows.length"
                    :movies="[...appStore.watchlist.shows].reverse()"
                  />
                  <div v-else class="loading-div">
                    <h5>No content</h5>
                  </div>
                </div>
                <div v-else>
                  <div class="loading-div">
                    <h5>No content</h5>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <div class="centered-children" v-else>
        <div class="form">
          <div
            class="p-4 t-c w-100p h-100p br-4 sandes d-flex ai-center jc-center"
          >
            <h1 class="fs-20">Please wait...</h1>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
import {useAppStore} from '@/stores/app'
const appStore = useAppStore()
</script>