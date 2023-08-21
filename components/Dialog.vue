<template>
    <Teleport to="#dialog-slot">

        <div class="dialog-overlay">
             <div style="margin: 0 auto" class="w-500px p-10 dialog bg-card2">
            
            <h4 class="fs-18 fw-6">{{ title }}</h4>
              <div class="mt-4">
             <slot />
                <div class="dflex _row mt-3 gap-10 " style="justify-content: flex-end;">
                  <button @click="_onOk" class="fw-6 btn btn-sm btn-success color-white ">Confirm</button>
                  <button @click="_onCancel" class="fw-6 btn btn-sm btn-dark color-white ">Cancel</button>
                </div>
  
                <div class="mt-2 form-group err"></div>
              </div>
          </div>
        </div>
    </Teleport>
     
</template>
<script setup lang="ts">

const props = defineProps({
    title: {
        type: String,
        default: "Dialog"
    },
    onOk: Function,
    onCancel: Function,
})

const _onCancel = ()=>{
    if (props.onCancel) props.onCancel()
}
const _onOk = ()=>{
    if (props.onOk) props.onOk()
    if (props.onCancel) props.onCancel()
}
onMounted(()=>{
})
</script>

<style lang="scss">


</style>