<script lang="ts">
    import { type HTMLAttributes } from "svelte/elements";


    interface IProps extends HTMLAttributes<any>{page: number; total: number; onPrev?: (page: number)=>any; onNext?: (page: number)=> any}
    let {page = $bindable(1), onNext, onPrev, total, class: _class, ...props}: IProps = $props()
</script>
<div class={"mx-auto mt-4 w-100p flex justify-center " + _class || ''} {...props}>
    <div class="join shadow-lg bg-base-200 z-[51]">
        <button
            onclick={async()=>{
                if (onPrev) 
                    return await onPrev(page);
                page -= 1
            }}
            disabled={page == 1}
            class="join-item btn border-1 border-card bg-base-200">«</button
        >
        <button class="join-item btn border-1 border-card bg-base-200"
            >Page <span class="text-white">{page}</span> of
            <span class="text-white">{total}</span></button
        >
        <button
            onclick={async()=>{
                if (onNext)
                    return await onNext(page);
                page += 1
            }}
            disabled={page == total}
            class="join-item btn border-1 border-card">»</button
        >
    </div>
</div>