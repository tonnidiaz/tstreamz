<template>
  <div class="sidemenu">
    <nav class="navbar navbar-dark container">
      <div class="" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item" @click="hide">
            <NuxtLink class="nav-link" to="/movies"> Movies </NuxtLink>
          </li>
          <li class="nav-item" @click="hide">
            <NuxtLink to="/tv" class="nav-link"> TV Shows </NuxtLink>
          </li>
          <li class="nav-item" @click="showGenres" @mouseleave="hideGenres">
            <div class="pos-rel">
              <a class="nav-link pointer"> Genre </a>
              <Genres />
            </div>
          </li>

          <li class="nav-item" @click="hide">
            <NuxtLink to="/search" class="nav-link"> Search </NuxtLink>
          </li>
          <li class="nav-item" @click="hide">
            <NuxtLink to="/contact" class="nav-link">
              Report issues
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import $ from "jquery";

  function showGenres() {
      $(".genres").addClass("active");
    }
    function hide() {}

    function hideGenres() {
      $(".genres").removeClass("active");
    }
</script>
