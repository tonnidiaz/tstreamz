<script lang="ts">
    import { localApi } from "@/lib/api";
    import { appStore } from "@/stores/app.svelte";
    import { setWatchlist, userStore } from "@/stores/user.svelte";
    import type { IObj } from "@cmn/utils/interfaces";

    import UButton from "@repo/ui/components/UButton.svelte";
    import type { HTMLAttributes } from "svelte/elements";

    let progress = $state(false);

    let { ready } = $derived(appStore);
    let { user, watchlist } = $derived(userStore);

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

        const fd = new FormData();
        fd.append("watchlist", JSON.stringify(newWList));
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
                console.log(err);
                progress = false;
            });
    }
</script>

<div class={`${_class}`} {...props}>
    {#if !(isShow ? watchlist?.shows : watchlist?.movies)?.find((it: any) => it?.id === item?.id)}
        <UButton
            onclick={addToList}
            title="Add to watchlist"
            class="btn-none fs-14 wlst-btn btn-outline"
            disabled={progress}
        >
            <i class="fi fi-br-bookmark"></i>
        </UButton>
    {:else}
        <UButton
            onclick={rmvFromList}
            title="Remove from watchlist"
            class="btn-none color-orange fs-14 wlst-btn btn-outline"
            disabled={progress}
        >
            <i class="fi fi-sr-bookmark"></i>
        </UButton>
    {/if}
</div>

<style>
</style>
