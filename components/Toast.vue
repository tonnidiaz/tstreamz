<template>
    <div :class="`toast ${isErr ? 'is-err' : isOk ? 'is-ok' : ''}`">
        {{ txt }}
    </div>
</template>
<script setup lang="ts">
defineProps({
    isErr: Boolean,
    isOk: Boolean,
    txt: String
})
</script>