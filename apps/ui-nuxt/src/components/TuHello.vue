<script setup lang="ts">
import { UI_CONFIG } from '#lib/conts.js';

</script>

<template>
    <div>
        <h1 style="font-size: 25px;font-weight: 600;text-align: center;">Hello from TU</h1>
        <p><b>Username: </b>{{ UI_CONFIG.username }}</p>
    </div>
</template>