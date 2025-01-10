<script lang="ts">
    import TMeta from "@/components/TMeta.svelte";
    import TuSelect from "@repo/ui/components/TuSelect.svelte";
    import UButton from "@repo/ui/components/UButton.svelte";
    import UInput from "@repo/ui/components/UInput.svelte";
    import type { ISelectItem } from "@/lib/interfaces";
    import { appStore } from "@/stores/app.svelte";
    import type { IObj } from "@cmn/utils/interfaces";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import type { PageData } from "../$types";
    import CtxMenu2 from "@repo/ui/components/CtxMenu2.svelte";
    import { page } from "$app/stores";
    import { kucoinInstrus } from "@pkg/cmn/utils/data/instrus";
    import { getInstrus } from "@pkg/cmn/utils/functions";
    import { sleep } from "@cmn/utils/funcs";

    let {cnt} = appStore
 
    onMount(()=>{
        console.log("Mounted")
        console.log($page.url.searchParams.get("red"))
        setTimeout(()=>{
            
        }, 5000)
        return ()=>{
            console.log("UnMounted")
        }
    })

    let {data} : {data: PageData} = $props()

   

    let opt = $state(1)
    let opts = $state<ISelectItem[]>([{label: "Option 1", value: 1}, {label: 'Option 2', value: 2}])

    let cancelLoop = false
    let loopRunning = false
    let invokedAt = 0, _invokedAt = 0;
    const invokeFunc = async () =>{
        
        _invokedAt = Date.now();
        if (!invokedAt) invokedAt = _invokedAt
        cancelLoop = loopRunning
        loopRunning = true
        console.log("Func call\n");

        let i = 0
        for (let pair of getInstrus("okx").sort()){
            i += 1
            console.log(`\n[${i}] Adding ${pair}`, {invokedAt, _invokedAt}, "\n")
            if (invokedAt < _invokedAt && i != 1){
                invokedAt = _invokedAt
                // loopToken = tkn
                console.log(`[${i}] Loop cancelled\n`);
                break;
            }
            await sleep(3000)
        }
    }
    onMount(()=>{
        // console.log($path);
        setTimeout(()=>{
            console.log("Update opts");
            opts = [...opts, {label: "Option 3", value: 3}, {label: "Option 4", value: 4, disabled: true}]
            setTimeout(()=>{
                opt = 3
            }, 2000)
        },3000)
    })
    // $inspect(opts)

  let menuOpen = $state(false)
$effect(()=>{
    const rfval = opt
    console.log({rfval});
})
   
</script> 
<TMeta title="RF"/>
<div class="p-4 flex flex-col gap-2" style="width: 500px;">
    <h1>Research Facility</h1>
    <div class="p-2 border-1 flex flex-col gap-2 border-card rounded-md bg-base-100 w-500px min-h-200px" id="portal">
      <div class="p-2 border-1 border-card">
        <h2>Global state</h2>
        <UButton onclick={_=>{appStore.cnt += 1}}>Counter {appStore.cnt}</UButton>
        <UButton class="btn-primary" loading>Hello fool</UButton>
      </div>
        <TuSelect options={opts} bind:value={opt}/>
        <CtxMenu2 bind:open={menuOpen}>
            {#snippet toggler()}
                <UButton class="btn-primary w-150px">Toggle menu</UButton>
            {/snippet}
            <p>This is menu</p>
        </CtxMenu2>
        <div class="my-3 p-2 border-1 border-card overflow-hidden oy-hidden">
            <div class="flex justify-between">
                <CtxMenu2>
                {#snippet toggler()}
                    <UButton class="btn-secondary">Menu2</UButton>
                {/snippet}
                <p>This is 2nd menu</p>
                <p>This is 2nd menu</p>
                <p>This is 2nd menu</p>
            </CtxMenu2>
            <CtxMenu2>
                {#snippet toggler()}
                    <UButton class="btn-secondary">Menu2</UButton>
                {/snippet}
                <p>This is 2nd menu</p>
                <p>This is 2nd menu</p>
                <p>This is 2nd menu</p>
            </CtxMenu2>
            </div>
            
            <div class="mt-2">
                <h3>Some sub heading</h3>
            </div>
        </div>
        <UInput placeholder="Search here...">
            {#snippet leading()}
                k
            {/snippet}
            {#snippet trailing()}
                S
            {/snippet}
        </UInput>
        <UButton class="btn-primary" onclick={()=>{invokeFunc(); console.log('Here');}}>Invoke function</UButton>
    </div>
    <div class="p-4">
        <ul class="menu menu-menu menu-sm text-left justify-start open border-1 border-card dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-md s-h3e7SZQrEEpL">
            <li class="s-h3e7SZQrEEpL"><a data-sveltekit-reload="false" class="tu-link text- " href="/">Home<!----></a><!----></li> <li class="s-h3e7SZQrEEpL"><a data-sveltekit-reload="false" class="tu-link text- " href="/test/arbit/cross/coins">Cross-arbit cointest<!----></a><!----></li> <li class="s-h3e7SZQrEEpL"><div class="devider border-1 border-card w-100 undefined"></div><!----></li> <li class="s-h3e7SZQrEEpL"><a data-sveltekit-reload="false" class="tu-link text- " href="/test/arbit/compare/cross/coins">Cross-comp arbit cointest<!----></a><!----></li> <li class="s-h3e7SZQrEEpL"><a data-sveltekit-reload="false" class="tu-link text- " href="/test/arbit/compare/coins">Tri-comp arbit cointest<!----></a><!----></li> <li class="s-h3e7SZQrEEpL"><a data-sveltekit-reload="false" class="tu-link text- " href="/rf/ws/book-ticker">RF Book Ticker<!----></a><!----></li> <li class="s-h3e7SZQrEEpL"><a data-sveltekit-reload="false" class="tu-link text- " href="/rf/nets">Networks<!----></a><!----></li> <li class="s-h3e7SZQrEEpL"><a data-sveltekit-reload="false" class="tu-link text- " href="/app/config">App config<!----></a><!----></li> <li class="s-h3e7SZQrEEpL"><a data-sveltekit-reload="false" class="tu-link text- " href="/data/books">Orderbooks<!----></a><!----></li> <li class="s-h3e7SZQrEEpL"><a data-sveltekit-reload="false" class="tu-link text- " href="/test/candles">Candletest<!----></a><!----></li>
        </ul>
    </div>
</div>
