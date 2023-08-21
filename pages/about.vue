<template>
    <div class="mt-4 body">
      <TMeta
        title="About us -  TunedStreamz"
        :url="root + '/about'"
        :desc="`TunedStreamz is a free movie and tv show streaming site with daily update on new content.\nDESCLAIMER!\nTunedStreamz does not host or upload any of the movies and tv shows available on this site!We use legal means of embedding the content from a third-party site.`"
      />
  <fieldset class="fieldset border-card form">
    <legend>About us</legend>
  
        <div class="">
          <p>
            <b>TunedStreamz</b> is a free movie and tv show streaming site with
            daily update on new content.
          </p>
          <h4 class="fs-18">
            <b>DESCLAIMER! </b>
          </h4>
          <br />
          <p>
            TunedStreamz does not host or upload any of the movies and tv shows
            available on this site!
          </p>
          <p>
            We use legal means of embedding the content from a third-party site.
          </p>

          <h4 class="fs-18 text-center"><span><i class="fas fa-envelope"></i></span>&nbsp; <span class="color-orange">tunedstreamz@gmail.com</span></h4>
        </div>
  </fieldset>
      
    </div>
  </template>
  <script setup lang="ts">
  import { root } from '@/utils/constants';
  
  </script>
  