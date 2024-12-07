<script lang="ts">
    import { localApi } from "@/lib/api";
    import { appStore } from "@/stores/app.svelte";
    import { setUser, setWatchlist, userStore } from "@/stores/user.svelte";
    import { handleErrs } from "@cmn/utils/funcs";
    import type { IObj } from "@cmn/utils/interfaces";

    import UButton from "@repo/ui/components/UButton.svelte";
    import { onMount } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";

    let progress = $state(false);

    let { ready } = $derived(appStore);
    let {  watchlist, user} = $derived(userStore);

    interface IProps extends HTMLAttributes<any> {
        isShow?: boolean;
        item: IObj;
    }
    const { isShow, item, class: _class, ...props }: IProps = $props();

    function addToList() {
        progress = true;
        const inte = setInterval(() => {
            if (ready) {
                clearInterval(inte);
                next();
            }
        }, 1000);

        const next = () => {
            if (!user?.username) {
                alert("Please login or signup to add movies to your watchlist");
                progress = false;
                return;
            }

            let newList = [];
            if (
                (isShow && watchlist?.shows) ||
                (!isShow && watchlist?.movies)
            ) {
                newList = isShow
                    ? [...watchlist.shows, item]
                    : [...watchlist.movies, item];
            } else {
                newList = [item];
            }
            const newWList = isShow
                ? { ...watchlist, shows: newList }
                : { ...watchlist, movies: newList };
            const fd = new FormData();
            fd.append("watchlist", JSON.stringify(newWList));
            localApi
                .post("/user/watchlist", fd)
                .then((res) => {
                    setWatchlist(newWList);

                    alert(
                        isShow
                            ? "Series added to watchlist"
                            : "Movie added to watchlist"
                    );
                    progress = false;
                })
                .catch((err) => {
                    alert("Could not add to watchlist");
                    console.log(err);
                    progress = false;
                });
        };
        //progress = false;
    }

    async function addRmvList(act: 'add' | 'rmv') {
        try {
            console.log(`${act == 'add' ? 'Adding' : 'Removing'} watchlist...`);
            progress = true;
            if (!user?.username) {
                alert("Please login or signup to add movies to your watchlist");
                progress = false;
                return;
            }

            const res = await localApi.post('/user/watchlist', {act, isShow, item})
            setWatchlist(res.data)
            console.log('Watchlist updated');
        } catch (err) {
            console.log("Failed to update watchlist");
            handleErrs(err)
        } finally{
            progress = false
        }
    }
    function rmvFromList() {
        progress = true;
        let newList = [];
        if (watchlist) {
            newList = isShow
                ? watchlist.shows.filter((it: any) => it?.id !== item?.id)
                : watchlist.movies.filter((it: any) => it?.id !== item?.id);
        }
        const newWList = isShow
            ? { ...watchlist, shows: newList }
            : { ...watchlist, movies: newList };

        const fd = {
            isShow, item: item.id
        };
        localApi
            .post("/user/watchlist", fd)
            .then((res) => {
                setWatchlist(newWList);

                alert(
                    isShow
                        ? "Series removed from watchlist"
                        : "Movie removed from watchlist"
                );
                progress = false;
            })
            .catch((err) => {
                alert("Could not add to watchlist");
                handleErrs(err);
                progress = false;
            });
    }


  
</script>

<div class={`${_class}`} {...props} >
    {#if !(isShow ? watchlist?.shows : watchlist?.movies)?.find((it: any) => it?.id === item?.id)}
        <UButton
            onclick={_=> addRmvList('add')}
            title="Add to watchlist"
            class="btn-none fs-14 wlst-btn btn-outline rounded-full btn-rounded br-100 "
            disabled={progress}
        >
            <i class="fi fi-br-bookmark"></i>
        </UButton>
    {:else}
        <UButton
            onclick={_=>addRmvList('rmv')}
            title="Remove from watchlist"
            class="btn-none color-orange fs-14 wlst-btn btn-outline rounded-full btn-rounded br-100 "
            disabled={progress}
        >
            <i class="fi fi-sr-bookmark"></i>
        </UButton>
    {/if}
</div>

<style>
</style>
