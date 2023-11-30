<template>
  
  <NuxtLayout>
    <Head>
            <Link rel="stylesheet" href="/assets/fa/fa.css" />
        </Head>
        <NuxtPage>
            
        </NuxtPage>
        <div id="dialog-slot" class="aci"></div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import "@/src/assets/bootstrap/css/bootstrap.min.css";
import "@/src/styles/styles.scss";
import "@/src/styles/dialog.scss";
import "@/src/styles/toast.scss";

const route = useRoute()
watch(()=> route.fullPath, (val, oldVal)=>{
    closeMenu(null)
}, { deep: true})

useHead({
    script: [{
         src: "//pl17439643.toprevenuegate.com/331a0c3ab2ba863abff2fd7c2a9feee5/invoke.js",
         async: "async",
         "data-cfasync":false, 
    }]
})
</script>
