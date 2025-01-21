<script lang="ts">
    import { onMount, untrack } from "svelte";
    import * as mathlive from "mathlive";
    import { marked } from "marked";

    import UButton from "@repo/ui/components/UButton.svelte";
    import {
        capitalizeFirstLetter,
        handleErrs,
        isTuError,
    } from "@cmn/utils/funcs";
    import { showToast } from "@repo/ui/lib/funcs";
    import { api } from "@/lib/api";
    import katex from "katex";
    import { parseMarkdown } from "@/lib/funcs";
    import { sleep } from "openai/core.mjs";

    const actions = ["solve for", "simplify", "factorize"] as const;
    type TAction = (typeof actions)[number];

    const STATE_KEY = "TUTEX_STATE";
    let _state = $state<{
        solution: string | undefined;
        formula: string;
        solutionKatex: string | undefined;
        act: TAction;
    }>({
        formula: "",
        solution: "",
        solutionKatex: "",
        act: "simplify",
    });

    let mfe: mathlive.MathfieldElement | undefined;

    
   

    const setAction = async (val: TAction) => {
        _state.act = val;
    };
    const submit = async () => {
        try {
            _state.solution = undefined;
            _state.solutionKatex = undefined;
            const res = await api.post("/solve", {
                q: _state.act + ": " + mathlive.convertLatexToAsciiMath (_state.formula),
            });
            const data = res.data;
            if (typeof data == "string") _state.solution = data;
            else console.log({ data });
        } catch (err) {
            handleErrs(err);
            showToast({ msg: isTuError(err) || "Failed to solve. Retry..." });
        }
    };

    const setupMarked = () => {
        const renderer = new marked.Renderer();
        renderer.text = (txt) => txt.text;
        marked.setOptions({
            breaks: true,
            gfm: true,
            renderer,
        });
    };

    const refreshMathJax = async () => {
        console.log("Refreshing MathJax...");
        await sleep(100);
        // console.log({MathJax});
        if (typeof MathJax !== "undefined") MathJax.typesetPromise();
    };
    
     $effect.pre(()=>{
        
     })
    onMount(() => {
         // Configure mathlive fonts direcory
       console.log("object");
        MathfieldElement.fontsDirectory = "/mathlive/fonts";
        // Update state
        _state = JSON.parse(
            localStorage.getItem(STATE_KEY) || JSON.stringify(_state)
        );
        mfe.setValue(_state.formula)
        setupMarked();
        refreshMathJax();
        mfe.applyStyle({
            fontFamily: "monospace",
            backgroundColor: "red",
        });
    });

    $effect(() => {
        // Update state in localStorage
        _state;
        localStorage.setItem(STATE_KEY, JSON.stringify(_state));
    });

    $effect(() => {
        _state.solution;
        untrack(async () => {
            _state.solutionKatex = parseMarkdown(_state.solution);
            refreshMathJax();
            // solutionKatex = katex.renderToString(formula, {
            //     throwOnError: true,
            // });
        });
    });

    $effect(() => {
        _state.solutionKatex;
        refreshMathJax();
    });
</script>

<div class="p-4 w-full flex flex-col gap-3">
    <div class="p-4 w-full rounded-md border-1 border-card">
        <div class="flex gap-2">
            {#each actions as action}
                <UButton
                    onclick={async () => await setAction(action)}
                    class={`fs-14 btn-primary ${_state.act !== action && "btn-outline"}`}
                    >{action.toUpperCase()}</UButton
                >
            {/each}
        </div>
    </div>
    <div class="border-1 w-full border-card input input-borderd math-field">
        <div class="w-full flex items-center gap-4">
            <span class="wp-nowrap font-poppins fw-6 text-white-1"
                >{capitalizeFirstLetter(_state.act)}:</span
            >
            <math-field
                oninput={e=> {_state.formula = mfe.getValue()}}
                bind:this={mfe}
                id="formula"
                class="flex-1"
            ></math-field>
            <UButton onclick={submit} class="btn-primary btn-sm">Solve</UButton>
        </div>
    </div>
    <div class="border-1 w-full border-card p-4 rounded-md">
        <h3 class="text-white-1 fw-6 mb-4 fs-18">Solution</h3>
        {#if !_state.solutionKatex}
            <div class="w-100 loading-div">
                <span><i class="loading loading-bars loading-lg"></i></span>
            </div>
        {:else}
            <div>
                <div class="mt-4">
                    <div class="raw-sol my-4">
                        <p
                            bind:innerHTML={_state.solutionKatex}
                            contenteditable="false"
                        ></p>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
