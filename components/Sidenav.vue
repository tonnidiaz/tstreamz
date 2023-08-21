<template>
  <div class="sidenav">
    <ul class="nav">
      <li class="nav-item mi" title="Home">
        <NuxtLink class="nav-link" to="/"
          ><i class="material-icons">house</i
        ></NuxtLink>
      </li>
      <li class="nav-item mi" title="Watchlist">
        <NuxtLink class="nav-link" to="/me/watchlist"
          ><i class="material-icons">bookmark</i
        ></NuxtLink>
      </li>
      <li class="nav-item mi" title="Search">
        <button @click="showSBar" class="nav-link btn-none"><i class="material-icons">search</i></button>
      </li>
      <li class="nav-item mi" title="Contact us">
        <NuxtLink class="nav-link" to="/contact"
          ><i class="material-icons">email</i
        ></NuxtLink>
      </li>

    </ul>
  </div>
</template>

<script setup lang="ts">
import $ from "jquery"
const showSBar = () => {
  //Shows the searchbar
  const sbar = $(".search-bar");
  
  const sInp = $(".search-bar input");
  sbar.addClass("active");
  sInp[0].focus();

  const hideSBar = (e: any) => {
    if (!$('.search-bar .sch')[0].contains(e.target)) {
      sbar.removeClass("active");
      document.removeEventListener("mousedown", hideSBar);
    }
  };
  document.addEventListener("mousedown", hideSBar);
};
</script>
 