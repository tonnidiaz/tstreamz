<script lang="ts">
    import { localApi } from "@/lib/api";
    import { appStore } from "@/stores/app.svelte";
    import { setWatchlist, userStore } from "@/stores/user.svelte";
    import { handleErrs } from "@cmn/utils/funcs";
    import type { IObj } from "@cmn/utils/interfaces";

    import UButton from "@repo/ui/components/UButton.svelte";
    import type { HTMLAttributes } from "svelte/elements";

    let progress = $state(false);

    let { ready } = $derived(appStore);
    let { watchlist, user } = $derived(userStore);

    interface IProps extends HTMLAttributes<any> {
        isShow?: boolean;
        item: IObj;
    }
    const { isShow, item, class: _class, ...props }: IProps = $props();

    async function addRmvList(act: "add" | "rmv") {
        try {
            console.log(`${act == "add" ? "Adding" : "Removing"} watchlist...`);

            progress = true;
            if (!user?.username) {
                alert("Please login or signup to add movies to your watchlist");
                progress = false;
                return;
            }

            const res = await localApi.post("/user/watchlist", {
                act,
                isShow,
                item,
            });
            setWatchlist(res.data);
            console.log("Watchlist updated");
        } catch (err) {
            console.log("Failed to update watchlist");
            handleErrs(err);
        } finally {
            progress = false;
        }
    }
</script>

<div class={`${_class}`} {...props}>
    {#if !(isShow ? watchlist?.shows : watchlist?.movies)?.find((it: any) => it?.id === item?.id)}
        <UButton
            onclick={(_) => addRmvList("add")}
            title="Add to watchlist"
            class="btn-none fs-14 wlst-btn btn-outline rounded-full btn-rounded br-100 "
            disabled={progress}
            showLoader={false}
        >
            <i class="fi fi-br-bookmark"></i>
        </UButton>
    {:else}
        <UButton
            onclick={(_) => addRmvList("rmv")}
            title="Remove from watchlist"
            class="btn-none color-orange fs-14 wlst-btn btn-outline rounded-full btn-rounded br-100 "
            disabled={progress}
            showLoader={false}
        >
            <i class="fi fi-sr-bookmark"></i>
        </UButton>
    {/if}
</div>

<style>
</style>
