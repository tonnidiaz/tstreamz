<script lang="ts">
    import { page } from "$app/state";
    import VideosPage from "@/components/VideosPage.svelte";
    import { type IVideoSide } from "@cmn/utils/tu-wwe/interfaces";
    import { onMount } from "svelte";

    let {side} = $derived(page.params);


</script>

<VideosPage side={side as IVideoSide}/>