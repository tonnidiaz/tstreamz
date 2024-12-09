<div class="h-100p w-100p flex items-center justify-center">
    <TMeta title={`Logout - ${SITE}`} />

    <h1 class="text-center title">Signing out...</h1>
</div>
<script lang="ts">
    import TMeta from "@/components/TMeta.svelte";
    import { SITE, STORAGE_KEYS } from "@/lib/constants";
    import { setUser } from "@/stores/user.svelte";
    import { onMount } from "svelte";

    onMount(()=>{
        // return
        setUser(null)
        localStorage.removeItem(STORAGE_KEYS.authTkn);
        location.href = "/";
    })
</script>