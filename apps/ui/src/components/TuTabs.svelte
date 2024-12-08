<script lang="ts">
    import e from "cors";
    import { onMount, untrack, type Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";

    let labelsParent: HTMLDivElement;
    let contentsParent: HTMLDivElement;

    interface IProps extends HTMLAttributes<any> {
        label: Snippet;
        content: Snippet;
        tab?: number;
    }
    let {
        label,
        content,
        class: _class,
        tab = $bindable(0),
        ...props
    }: IProps = $props();

    const getLabels = () => labelsParent.querySelectorAll("a.tab-label");
    const getContents = () => contentsParent.querySelectorAll(".tab-cont");
    let originalContents = $state<NodeListOf<Element>>();

    onMount(() => {
        const labels = getLabels();
        const conts = getContents();
        conts.forEach((el, i) => {
            (el as any).dataset.tab = i;
        });
        originalContents = conts;
        labels.forEach((lbl, i) => {
            console.log({ i });
            lbl.role = "tab";
            lbl.classList.add("tab");
            if (tab == i) lbl.classList.add("tab-active");
            lbl.addEventListener("click", () => {
                console.log("click", i);
                tab = i;
            });
        });
    });

    $effect(() => {
        // watch tab
        const labels = getLabels();
        // console.log({tab});
        labels.forEach((lbl, i) => {
            lbl.classList.remove("tab-active");
            if (tab == i) lbl.classList.add("tab-active");
        });

        const conts = getContents();
        // Update original contents
        untrack(() => {
            originalContents = [...originalContents].map((el, i) => {
                const _el = [...conts].find(
                    (el) => Number((el as any).dataset.tab) == i
                );
                if (_el) el = _el;
                return el;
            }) as any;

            originalContents.forEach((el: any, i) => {
                // console.log(el);
                // el.classList.remove('hidden')
                try {
                    contentsParent.removeChild(el);
                } catch (err) {}

                if (Number(el.dataset.tab) == tab) contentsParent.appendChild(el);
            });
        });
    });
</script>

<div class={`w-100p h-100p ${_class || ""}`} {...props}>
    <div
        role="tablist"
        class="tabs tabs-bordered tab-labels"
        bind:this={labelsParent}
    >
        {@render label()}
    </div>
    <div class="tabs-" bind:this={contentsParent}>
        {@render content()}
    </div>
</div>
