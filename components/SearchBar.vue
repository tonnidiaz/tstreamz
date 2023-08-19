<template>
    <div class="search-bar">
    <div class="pos-rel">
      <div class="sch br-4 rls form pos-rel">
        <button
          @click="close" 
          title="Close"
          class="btn-none fs-18 top-right p-2"
        >
          <i class="fal fa-times"></i>
        </button> 
        <form ref="sform" @submit="handleSubmit" class="search-form" action="/search">
          <div class="form-group d-flex jc-center">
            <input
              name="search"
              type="search"
              class="form-control search"
              placeholder="Enter movie or tv show title"
            />
            <button type="submit" class="btn-none search-icon">
              <i class="fal fa-search"></i>
            </button>
            <div class="search-results card p-4">
        
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import $  from "jquery";

const router = useRouter()

const close = () => { 
    $(".search-bar").removeClass("active");
 }

 function  handleSubmit(e: any) {
      e.preventDefault();
      const form = e.currentTarget;
      const inp = form["search"];
      close();
      router.push("/search?q=" + inp.value);
    }
</script>