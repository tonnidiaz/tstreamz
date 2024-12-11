<script>
    import PellerBanner from "@/components/PellerBanner.svelte";
    import PellerBanner2 from "@/components/PellerBanner2.svelte";
    import PellerPopunder from "@/components/PellerPopunder.svelte";
    import PellerPush from "@/components/PellerPush.svelte";
import TMeta from "@/components/TMeta.svelte";
    import { SITE } from "@/lib/constants";

</script>
<TMeta title={`Research Facility - ${SITE}`}/>

<div class="p-4">
    <h1 class="title">RF</h1>
    <PellerPopunder/>
    <PellerPush/>
</div>