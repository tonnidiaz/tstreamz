<script lang="ts">
    import { api } from "@/lib/api";
    import type {  TaskAct } from "@/lib/interfaces";
    import { handleErrs, isTuError, sleep } from "@cmn/utils/funcs";
    import type { ITask } from "@cmn/utils/interfaces";
    import CtxMenu2 from "@repo/ui-sv/components/CtxMenu2.svelte";
    import MenuItem from "@repo/ui-sv/components/MenuItem.svelte";
    import UAccordion from "@repo/ui-sv/components/UAccordion.svelte";
    import UButton from "@repo/ui-sv/components/UButton.svelte";
    import UDivider from "@repo/ui-sv/components/UDivider.svelte";
    import { showToast } from "@repo/ui-sv/lib/funcs";
    import { onMount } from "svelte";

    //     const onMenuItemClick = async (e, fn: (e) => any) => {
    //     const close = await fn(e);
    //     if (close) menuOpen = false;
    // };

    let tasks: ITask[] | null = $state(null);

    const fetchTasks = async () => {
        try {
            tasks = null;
            const { data } = await api.get("/tasks");
            tasks = data;
        } catch (err) {
            tasks = [];
            handleErrs(err);
            showToast({
                err: true,
                msg: isTuError(err) || "Failed to fetch tasks",
            });
        }
    };

    onMount(() => {
        fetchTasks();
    });


    async function performTaskAct(id: string, act: TaskAct) {
        try {
            console.log({act, taskId: id});
            const {data} = await api.post(`/tasks/${act}`, {id})
            console.log(data);
            return true
        } catch (err) {
            handleErrs(err)
            showToast({err: true, msg: isTuError(err) || "Failed to perform action"})
            
        }
    }
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
                            <div
                                class="flex justify-between items-center w-full gap-2"
                            >
                                <h3>
                                    <span class="text-primary"
                                        >[{new Date(task.interval * 60000)
                                            .toISOString()
                                            .split("T")
                                            .pop()
                                            ?.split(".")[0]}]</span
                                    >
                                    {task.name}
                                </h3>
                                <CtxMenu2>
                                    {#snippet toggler()}
                                        <UButton
                                            ><i
                                                class="fi fi-br-menu-dots-vertical rounded-full"
                                            ></i></UButton
                                        >
                                    {/snippet}
                                    <ul>
                                        <MenuItem onclick={async () => await performTaskAct(task.id, 'run')}>Run</MenuItem>
                                        <MenuItem onclick={async () => await performTaskAct(task.id, 'pause')}>Pause</MenuItem>
                                        <MenuItem onclick={async () => await performTaskAct(task.id, 'resume')}>Resume</MenuItem>
                                        <UDivider />
                                        <MenuItem onclick={async () => await performTaskAct(task.id, 'remove')}>Remove</MenuItem>
                                        <MenuItem onclick={async () =>await sleep(3000)}>Sleep</MenuItem>
                                        
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
