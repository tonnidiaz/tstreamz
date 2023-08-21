<template>
    <form @submit="handleSubmit" class="home-form m-auto" action="#">
      <div class="form-group d-flex ai-center pos-rel m-auto">
        <button type="submit" class="btn-none pos-abs fs-18 search-btn left">
          <i class="far fa-search"></i>
        </button>
        <input
          :value="value"
          placeholder="Enter movie or tv show title"
          name="search"
          type="search"
          class="tu-inp custom-padding m-auto"
        />
      </div>
    </form>
  </template>
  
  <script setup lang="ts">

  const router = useRouter()
  function  handleSubmit(e: any) {
        e.preventDefault();
        const inp = e.currentTarget["search"];
  
        router.push("/search?q=" + inp.value);
      }
 
      defineProps({
        value: Object
      })
  </script>
  