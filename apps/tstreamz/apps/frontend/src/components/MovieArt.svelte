<script lang='ts'>
    import { imgUrl } from "@/lib/constants";

    let {img} : {img: string} = $props()
</script>

    <div
        style="flex-shrink: 0"
        class="w-225px h-280px pos-rel m-auto md:m-unset art"
    >
        <img
            alt="Movie banner"
            loading="lazy"
            class="rounded-md border-card border-1 p-1"
            width="100%"
            height="auto"
            src={imgUrl + img}
        />
    </div>
