<template>
    <div class="search-page"
    >
      <TMeta
        title="Search Movies and TV shows - TunedStreamz"
        desc="Browse any movie or tv show of your preference"
        keywords="tunedstreamz search, tunedstreams search, tuned streamz search, search movies tunedstreamz, search movies, latest movies, latest series, search series tunedstreamz"
      />
      <div>
        <div class="bg-card pd-10 mb-0 tu-searchbar">
            <div class="w-500 m-auto">
          <SearchForm :value="`${$route.query.q ?? ''}`" />
            </div>
        </div>
        
        <!---
  <ShareNetwork
          network="facebook"
          url="https://news.vuejs.org/issues/180"
          title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
          description="This week, I’d like to introduce you to 'Vite', which means 'Fast'. It’s a brand new development setup created by Evan You."
          quote="The hot reload is so fast it\'s near instant. - Evan You"
          hashtags="vuejs,vite"
        >
          Share on Facebook
        </ShareNetwork>-->
        <div class="m-auto" v-if="$route.query.q">
           
          <section class="filter-sec m-0"> 
                <fieldset style="gap: 10px" class="d-flex formset">
                    <legend class="fs-18">
              Search results for:
              <span class="color-orange">{{ $route.query.q }}</span>
            </legend>
                  <fieldset class="checkbox-switc">
                     
                    <input
                    class="form-check form-control"
                      @change="handleCheck"
                      type="checkbox"
                      name="movies"
                      :checked="filter.movies"
                      id="checkbox-1"
                    />
                    <label
                      for="checkbox-1"
                      title="Show/Hide Movies"
                      class="checkbox-right"
                      >Movies</label
                    >
                  </fieldset>
                  <fieldset class="checkbox-switc">
                    <input
                    class="form-check form-control"
                      @change="handleCheck"
                      type="checkbox"
                      name="shows"
                      :checked="filter.shows"
                      id="checkbox-2"
                    />
                    <label
                      for="checkbox-2"
                      title="Show/Hide Movies"
                      class="checkbox-right"
                      >TV shows</label
                    >
                  </fieldset>
                </fieldset>
        </section>
          <section v-if="filter.movies" class="mt-4 mv-50">
        <fieldset class="formset w-100p">
            <legend class="mb-2">Movies</legend>
              <div class="mt-4 no-wrap ai-center">
              <div v-if="ready">
                <div v-if="movies.length">
                  <SearchRes v-for="(it, i) in movies" :key="i" :movie="it" />
                </div>
  
                <div v-else class="loading-div">
                  <h4>No results</h4>
                </div>
              </div>
  
              <div v-else class="loading-div">
                <h4>Loading...</h4>
              </div>
            </div>
        </fieldset>
            
          
          </section>
          <section v-if="filter.shows" class="mt-4 mv-50">
            <fieldset class="formset w-100p">
                            <legend class="mb-4">TV Shows</legend>
            <div class="mt-4 no-wrap ai-center">
              <div v-if="ready">
                <div v-if="shows.length">
                  <SearchRes
                    v-for="(it, i) in shows"
                    :key="i"
                    :movie="it"
                    :isShow="true"
                  />
                </div>
                <div v-else class="loading-div">
                  <h4>No results</h4>
                </div>
              </div>
  
              <div v-else class="loading-div">
                <h4>Loading...</h4>
              </div>
            </div>
            </fieldset> 
          </section>
        </div>
        
      </div>
      <DillaBanner/>
      <TerraBanner/>
      </div>
  
  </template>

<script setup lang="ts">
import axios from 'axios';

const ready = ref<boolean>(false),
  setReady = (val : boolean) => {
    ready.value = val;
  };
const movies = ref<any>(false),
  setMovies = (val : any) => {
    movies.value = val;
  };
const shows = ref<any>(false),
  setShows = (val : any) => {
    shows.value = val;
  };
const filter = ref({ movies: true, shows: true }),
  setFilter = (val : typeof filter.value) => {
    filter.value = val;
  };


  function handleCheck(e: any) {
      const { checked, name } : {checked : boolean, name : "movies" | "shows"} = e.currentTarget;
      console.log(checked, name)
      let  newFilter = filter.value;
      newFilter[name] = checked
      setFilter(newFilter)
      //setFilter({...filter.value,  :  })
    }
    function search(q: string) {
      // clear errything
      //const { setMovies, setShows} = this
      setReady(false);
      console.log("Searching...");
      axios
        .get("/api/search?q=" + q)
        .then((r) => {
          const { shows, movies } = r.data.data;
          setMovies(movies);
          setShows(shows);
          setReady(true);
        })
        .catch((err) => { console.log(err);
          setReady(true);
        });
    }

    const route = useRoute();

    watch(() => route.query,
    (val)=>{
        const { q } = val
        if (q){
            search(`${q}`);
        }
    })
    onBeforeMount(()=>{
        const { q } = route.query
        if (q){
            search(`${q}`);
        }
    })
</script>

<style lang="scss">


.tu-searchbar{
    //position: fixed;
    width: 100%;
    left: 0;
    //top: 54px;
    z-index: 9;
}

.search-page{
    margin-top: 64px;
    .formset{
        padding: 0 !important;
    }
}
</style>