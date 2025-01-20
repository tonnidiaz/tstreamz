<script lang="ts">
    import axios from "axios"
 
    const dld = async () => {
        console.log("Downloading...");
        const url = "https://www.youtube.com/watch?v=MlzEB5AYSjA";
        
    };
    const dld2 = async () =>{
        console.log("Downloading2...");
        axios.get("/api/dld").then(r=>{
            console.log(r)
        }).catch(err=>{
            console.log("Failed")
            console.log(err);
        })
    }
</script>

<svelte:head>
    <title>Download - Tu Yt-dld</title>
</svelte:head>
<div>
    <h1>Download page</h1>
    <button onclick={dld2}>Download</button>
</div>
