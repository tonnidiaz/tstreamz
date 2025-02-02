<div class="tu-error-page">
    <div class="error">
        <span class="status">{page.status}</span>
        <div class="message">
            <h1>{page.error.message.replaceAll("tu:", "")}</h1>
        </div>
    </div>
</div>

<script lang="ts">
    import {page} from "$app/state"
</script>
<style lang="scss">

 
</style>