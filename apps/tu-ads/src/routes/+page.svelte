<script lang="ts">
    import axios from "axios"
    import { onMount } from "svelte";
    const ipUrl = "https://api.ipify.org/?format=json"
    let ip = $state()

    const  getIpAddr = async () =>{
        try {
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

<div>
   <h1>Welcome to SvelteKit</h1>
<p><b>IP: </b> {ip || 'No ip'}</p> 
</div>

<style>
    
</style>