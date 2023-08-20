
<template>
    <div class="form-container body">
        <TMeta
            title="Email verification - TunedStreamz"
            keywords="login tunedstreamz, tunedstreamz login, tunedstreamz auth"
          />

          <fieldset class="formset m-auto t-c">
            <legend>Email verification</legend>
             <div  class="t-c" v-if="verified">
                <h1 class="fs-20">Email verification successful!</h1>
                <h3 class="fs-18 color-orange">Redirecting...</h3>
                 </div>
            <h1 class="t-c fs-20"  v-else>Verifying email...</h1>
        </fieldset>
           
    </div>
</template>
<script setup lang="ts">

import {dbUrl} from '@/utils/constants'
import {ref, onBeforeMount} from "vue"
const verified = ref(false)


const route = useRoute();
const id = ref(route.params.id)

const url = `${dbUrl}/`
console.log(url)
const { data, error } = await useFetch<any>(url, {
    watch: [id]
});
console.log(error.value);
/* if (error){
    throw createError({ statusCode: error.value?.statusCode, statusMessage: error.value.statusMessage })
} */

onBeforeMount(()=>{
    verified.value = true
})
definePageMeta({
    layout: "nohead"
})
</script>