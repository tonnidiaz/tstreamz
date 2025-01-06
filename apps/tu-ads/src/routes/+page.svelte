<script lang="ts">
    import Banner from "@/components/Banner.svelte";
    import axios from "axios"
    import { onMount } from "svelte";
    const ipUrl = "https://api.ipify.org/?format=json"
    let ip = $state()

    const  getIpAddr = async () =>{
        try {
            console.log("Getting ip address...")
            ip = undefined
            const r = await axios.get(ipUrl)
            ip = r.data.ip
        } catch (err) {
            console.log(err);
        }
    }

    onMount(()=>{
        getIpAddr()
    })
</script>

<div class="p-4">
   <h1>Welcome to SvelteKit</h1>
<p><b>IP: </b> {ip || 'No ip'}</p> 
<div class="mt-4">
    <Banner/>
    <Banner num={2}/>
    <Banner num={3}/>
    <Banner num={4}/>
    <Banner num={5}/>
</div>
</div>

<style>
    
</style>
