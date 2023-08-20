<template>
    <div>
      <button
        @click="addToList"
        title="Add to watchlist"
        v-if="
          !(isShow ? appStore.watchlist?.shows :appStore. watchlist?.movies)?.find(
            (it: any) => it?.id === item?.id
          )
        "
        class="btn-none fs-18 wlst-btn"
        :disabled="progress"
      >
        <i class="far fa-bookmark"></i>
      </button>
      <button
        @click="rmvFromList"
        title="Remove from watchlist"
        v-else
        class="btn-none color-orange fs-18 wlst-btn"
        :disabled="progress"
      >
        <i class="fas fa-bookmark"></i>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { post } from "@/utils/api";
import { useAppStore } from "@/stores/app";
import {storeToRefs} from 'pinia'

  const progress = ref(false);

  const appStore = useAppStore()
const  { user, watchlist, ready} = storeToRefs(appStore)

  const props = defineProps({
    isShow: {type: Boolean},
    item : {type: Object}
  })


  function addToList() {
      progress.value = true;
      const inte = setInterval(() => {
        if (ready.value) {
          clearInterval(inte);
          next();
        }
      }, 1000);

      const next = () => {
        if (!user.value?.username) {
          alert("Please login or signup to add movies to your watchlist");
          progress.value = false;
          return;
        }

        let newList = [];
        const {isShow, item} = props
        if ((isShow && watchlist.value?.shows) || (!isShow && watchlist.value?.movies)) {
          newList = isShow
            ? [...watchlist.value.shows, item]
            : [...watchlist.value.movies, item];
        } else {
          newList = [item];
        }
        const newWList = isShow
          ? { ...watchlist, shows: newList }
          : { ...watchlist, movies: newList };
        const fd = new FormData();
        fd.append("watchlist", JSON.stringify(newWList));
        post("/user/watchlist", fd)
          .then((res) => {
            appStore.setWatchlist(newWList);

            alert(
              isShow ? "Series added to watchlist" : "Movie added to watchlist"
            );
            progress.value = false;
          })
          .catch((err) => {
            alert("Could not add to watchlist");
            console.log(err);
            progress.value = false;
          });
      };
      //progress.value = false;
    }
    function rmvFromList() {
   
      const { isShow, item } = props;
         progress.value = true;
      let newList = [];
      if (watchlist) {
        newList = isShow
          ? watchlist.value.shows.filter((it : any) => it?.id !== item?.id)
          : watchlist.value.movies.filter((it : any) => it?.id !== item?.id);
      }
      const newWList = isShow
        ? { ...watchlist, shows: newList }
        : { ...watchlist, movies: newList };

      const fd = new FormData();
      fd.append("watchlist", JSON.stringify(newWList));
      post("/user/watchlist", fd)
        .then((res) => {
         appStore. setWatchlist(newWList);

          alert(
            isShow
              ? "Series removed from watchlist"
              : "Movie removed from watchlist"
          );
          progress.value = false;
        })
        .catch((err) => {
          alert("Could not add to watchlist");
          console.log(err);
          progress.value = false;
        });
    }
  </script>
  <style>
  .wlst-btn:disabled {
    color: rgb(99, 99, 99);
    text-shadow: 0 0px 10px orange;
    animation: 0.5s infinite blinky;
  }
  
  @keyframes blinky {
    0% {
      text-shadow: 0 0px 10px orange;
      opacity: 0.7;
    }
    50% {
      text-shadow: 0 0px 10px rgba(255, 166, 0, 0.359);
      opacity: 0.5;
    }
  }
  </style>
  