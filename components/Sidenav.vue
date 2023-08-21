<template>
  <div class="sidenav">
    <ul class="nav">
      <li class="nav-item" title="Home">
        <NuxtLink class="nav-link" to="/"
          ><i class="far fa-home"></i
        ></NuxtLink>
      </li>
      <li class="nav-item" title="Watchlist">
        <NuxtLink class="nav-link" to="/me/watchlist"
          ><i class="far fa-bookmark"></i
        ></NuxtLink>
      </li>
      <li class="nav-item" title="Search">
        <button @click="showSBar" class="nav-link btn-none"><i class="fal fa-search"></i></button>
      </li>
      <li class="nav-item" title="Contact us">
        <NuxtLink class="nav-link" to="/contact"
          ><i class="far fa-envelope"></i
        ></NuxtLink>
      </li>
      <li class="nav-item" title="Notifications">
        <a disabled="" class="nav-link disabled" href="#"
          ><i class="fal fa-bell"></i
        ></a>
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
 