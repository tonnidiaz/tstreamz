<template>
    <button
      @click="showTrailer(id)"
      title="Show trailer"
      :class="
        'pos-rel btn btn-sm ' + (className ? className : 'btn-outline-secondary')
      "
    >
      <span>
        <i class="fal fa-video"></i>
      </span>
      &nbsp; Trailer
    </button>
  </template>
  
  <script setup lang="ts">
  import axios from "axios";
import { useAppStore } from "@/stores/app";
  import $ from "jquery"

const appStore = useAppStore();

const props = defineProps({
    isShow: Boolean,
    id: {
        type: Number, required: true},
    className: String
})
function showTrailer(id: number) {
      appStore.setTrailerId(null);
      appStore.setTrailerErr(null);
      $(".trailer-container").addClass("active");
      const url = props.isShow
        ? "/api/trailer/tv/" + id
        : "/api/trailer/m/" + id;
      axios
        .get(url)
        .then((r) => {
          const { trailer } = r.data;

          if (trailer?.key) appStore.setTrailerId(trailer.key);
          else appStore.setTrailerErr(true);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  </script>
  