<script lang="ts">
    import { api } from "@/lib/api";
    import { handleErrs, isTuError } from "@cmn/utils/funcs";
    import type { ITask } from "@cmn/utils/interfaces";
    import CtxMenu2 from "@repo/ui/components/CtxMenu2.svelte";
    import MenuItem from "@repo/ui/components/MenuItem.svelte";
    import UAccordion from "@repo/ui/components/UAccordion.svelte";
    import UButton from "@repo/ui/components/UButton.svelte";
    import UDivider from "@repo/ui/components/UDivider.svelte";
    import { showToast } from "@repo/ui/lib/funcs";
    import { onMount } from "svelte";

//     const onMenuItemClick = async (e, fn: (e) => any) => {
//     const close = await fn(e);
//     if (close) menuOpen = false;
// };

    let tasks: ITask[] | null = $state(null)

    const fetchTasks = async () => { 
        try {
            tasks = null
            const {data} = await api.get("/tasks");
            tasks = data
        } catch (err) {
            tasks = []
            handleErrs(err)
            showToast({err:true, msg: isTuError(err) || "Failed to fetch tasks"})
            
        }
     }


     onMount(()=>{
        fetchTasks()
     })
</script>

<div class="p-4 flex flex-col gap-2 h-full w-full">
    <h1 class="title text-center">Tu tasks</h1>
    <div class="flex-1">
        {#if !tasks?.length}
        <div class="loading-div m-auto">
            {#if !tasks}
            <span class="loading loading-lg"></span>
            {:else}
                <h3 class="fs-20">No tasks</h3>
            {/if}
        </div>
            
        {:else}
        <div class="flex flex-col gap-2 w-500px m-auto">
            {#each tasks as task, i}
                 <UAccordion>
                {#snippet label()}
                    <div class="flex justify-between items-center w-full gap-2">
                        <h3><span class="text-primary">[{task.interval}]</span> {task.name}</h3>
                        <CtxMenu2>
                            {#snippet toggler()}
                                <UButton
                                    ><i
                                        class="fi fi-br-menu-dots-vertical rounded-full"
                                    ></i></UButton
                                >
                            {/snippet}
                            <ul>
                                <MenuItem>Run</MenuItem>
                                <MenuItem>Pause</MenuItem>
                                <MenuItem>Resume</MenuItem>
                                <UDivider />
                                <MenuItem class="text-error">Delete</MenuItem>
                            </ul>
                        </CtxMenu2>
                    </div>
                {/snippet}

                {#snippet content()}
                    <p>{task.desc}</p>
                {/snippet}
            </UAccordion>
            {/each}
           
        </div>
        {/if}
    </div>
    
</div>
