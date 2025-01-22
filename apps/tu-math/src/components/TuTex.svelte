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
    import UInput from "@repo/ui/components/UInput.svelte";
    import UForm from "@repo/ui/components/UForm.svelte";
    import UTextarea from "@repo/ui/components/UTextarea.svelte";
    import UFormGroup from "@repo/ui/components/UFormGroup.svelte";
    import UAccordion from "@repo/ui/components/UAccordion.svelte";
    import UDivider from "@repo/ui/components/UDivider.svelte";
    import { dev } from "$app/environment";

    const actions = [
        "solve for",
        "simplify",
        "factorize",
        "expand",
        "complete the square",
        "evaluate",
        "differentiate",
        "integrate",
    ] as const;
    type TAction = (typeof actions)[number];
    
    const STATE_KEY = "TUTEX_STATE";
    let _state = $state<{
        solution?: string;
        additionalQuery?: string;
        formula?: string;
        solutionKatex?: string;
        act: TAction;
        var?: string;
        input?: { formula: string; action: TAction; additional?: string };
    }>({
        formula: "",
        solution: "",
        solutionKatex: "",
        act: "simplify",
    });

    let mfe: mathlive.MathfieldElement | undefined = $state();
    onMount(() => {
        // Configure mathlive fonts direcory
        window.MathfieldElement.fontsDirectory = "/mathlive/fonts";
        // Update state
        _state = JSON.parse(
            localStorage.getItem(STATE_KEY) || JSON.stringify(_state)
        );
        mfe.setValue(_state.formula);
        setupMarked();
        refreshMathJax();
    });

    $effect(() => {
        // Update state in localStorage
        _state;
        localStorage.setItem(STATE_KEY, JSON.stringify(_state));
    });
    const setAction = async (val: TAction) => {
        _state.act = val;
    };
    const submit = async (e) => {
        try {
            e.preventDefault();
            _state.solution = undefined;
            _state.solutionKatex = undefined;

            _state.input = {
                action: _state.act,
                formula: _state.formula,
                additional: _state.additionalQuery,
            };
            console.log(_state.formula);
            await refreshMathJax();
            const res = await api.post("/solve", {
                q: `${_state.act}${_state.act == "solve for" ? ` ${_state.var}` : ""}: ${mathlive.convertLatexToAsciiMath(_state.formula)}\n${_state.additionalQuery || ""}`,
            });
            const data = res.data;
            if (typeof data == "string") _state.solution = data;
            else console.log({ data });
        } catch (err) {
            _state.solution = "";
            handleErrs(err);
            showToast({
                msg: isTuError(err) || "Failed to solve. Retry...",
                err: true,
            });
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
        if (typeof window.MathJax !== "undefined") window.MathJax.typesetPromise();
    };

    $effect.pre(() => {});

    $effect(() => {
        _state.solution;
        untrack(async () => {
            _state.solutionKatex = parseMarkdown(_state.solution || "");
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
    <div class="md:p-4 p-2 w-full rounded-md border-1 border-card">
        <div class="flex gap-2 flex-wrap">
            {#each actions as action}
                <UButton
                    onclick={async () => await setAction(action)}
                    class={`fs-14 btn-primary ${_state.act !== action && "btn-outline"}`}
                    >{action.toUpperCase()}</UButton
                >
            {/each}
        </div>
    </div>
    <div
        class="md:p-4 p-2 w-full rounded-md border-1 border-card flex flex-col gap-2"
    >
        <UForm
            onsubmit={submit}
            class="flex flex-col gap-2 w-full"
        >
            <div class="w-full flex md:flex-row flex-col md:items-center gap-4">
                <span
                    class="wp-nowrap font-poppins fw-6 text-white-1 flex gap-2 items-center"
                    >{capitalizeFirstLetter(_state.act)}
                    {#if _state.act == "solve for"}
                        <span class="flex items-center">
                            <UInput
                                required
                                maxlength={1}
                                minlength={1}
                                placeholder="x"
                                inputClass="text-center input-sm p-0"
                                style="width: 15px;"
                                bind:value={_state.var}
                            />
                        </span>
                    {/if}</span
                >
                <div class="flex-1 input input-bordered border-box w-full">
                    <math-field
                        oninput={(e) => {
                            _state.formula = mfe.getValue();
                        }}
                        bind:this={mfe}
                        id="formula"
                        class="fs-18 font-monospace w-full"
                    ></math-field>
                </div>
            </div>
            <UFormGroup class="w-full" label="Additional query">
                <UTextarea
                    bind:value={_state.additionalQuery}
                    placeholder="e.g Round answer to 2 decimal places"
                />
            </UFormGroup>
            <UButton type="submit" class="btn-primary btn-md w-200px ml-auto"
                >Solve</UButton
            >
        </UForm>
    </div>

    <UAccordion open class="max-w-500px rounded-md m-auto">
        {#snippet label()}
            <div class="flex gap-2 w-full justify-between">
                <h3 class="text-white-1 fw-6 fs-18">Solution</h3>
                <UButton
                    class="btn-sm btn-primary"
                    onclick={() => (_state.solution = "")}>Clear</UButton
                >
            </div>
        {/snippet}
        {#snippet content()}
            {#if !_state.solution}
                <div class="w-100 loading-div">
                    {#if _state.solution == undefined}
                        <span
                            ><i class="loading loading-bars loading-lg"
                            ></i></span
                        >
                    {:else}
                        <p class="fs-20">No solution</p>
                    {/if}
                </div>
            {:else}
                <div>
                    {#if _state.input}
                        <div class="ml-4 mb-3">
                            <h3 class="fs-18 fw-6">Input</h3>
                            <div class="mt-2">
                                <p>
                                    <span class="fw-"
                                        >{_state.input.action.toUpperCase()}:
                                    </span>
                                    ${_state.input.formula}$
                                </p>
                                <p class="fs-13 fw-4">
                                    <i>({_state.input.additional || ""})</i>
                                </p>
                            </div>
                        </div>
                        <UDivider />
                    {/if}
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
        {/snippet}
    </UAccordion>
    {#if dev}
        <UButton class="btn-secondary" onclick={refreshMathJax}
            >Refresh Mathjax</UButton
        >
    {/if}
</div>
