<script lang="ts">
    import { localApi } from "@/lib/api";
    import { setTrailerId, setTrailerErr } from "@/stores/app.svelte";
    import { handleErrs } from "@cmn/utils/funcs";
    import _$ from "jquery";

    const {
        isShow,
        id,
        className,
        class: _class
    }: { isShow?: boolean; id: number; className?: string; class?: string } = $props();
    function showTrailer(id: number) {
        setTrailerId(null);
        setTrailerErr(null);
        _$(".trailer-container").addClass("active");
        const url = isShow ? "/trailer/tv/" + id : "/trailer/m/" + id;
        localApi
            .get(url)
            .then((r) => {
                const { trailer } = r.data;

                if (trailer?.key) setTrailerId(trailer.key);
                else setTrailerErr("true");
            })
            .catch((e) => {
                handleErrs(e);
            });
    }
</script>

<button
    onclick={() => showTrailer(id)}
    title="Show trailer"
    class={"pos-rel btn btn-sm btn-secondary items-center justify-center flex " +
        (className ? className : "btn-outline btn-secondary") + ` ${_class || ''}`}
>
    <span>
        <i class="fi fi-rr-film"></i>
    </span>
    <span>Trailer</span>
</button>
