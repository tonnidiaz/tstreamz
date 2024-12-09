<script lang="ts">
    import { onMount } from "svelte";
    import UInput, { type IUInputProps } from "./UInput.svelte";
    import jq from 'jquery'
    
    interface IProps extends IUInputProps {valid?: boolean; showValidation?: boolean}
    let { value = $bindable(), valid = $bindable(), showValidation = true, ...props }: IProps = $props();

    let passType = $state<"text" | "password">("password");

    const validClass = "text-white fw-6",
        invalidClass = "text-error-2";
    const passPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    let validationCont: HTMLDivElement;
    let parent: HTMLDivElement;

    onMount(() => {
        const pwdInp = parent.querySelector("input");
        let letter = validationCont.querySelector(".val-letter")!;
        let capital = validationCont.querySelector(".val-cap")!;
        let number = validationCont.querySelector(".val-num")!;
        let length = validationCont.querySelector(".val-len")!;

        // pwdInp.onfocus = () => {
        //     jq(".pwd-val").show();
        // };
        // pwdInp.onblur = () => {
        //     jq(".pwd-val").hide();
        // };
        const checkPass = () => {
            let lows = /[a-z]/g;
            if (pwdInp.value.match(lows)) {
                jq(letter).removeClass(invalidClass);
                jq(letter).addClass(validClass);
            } else {
                jq(letter).addClass(invalidClass);
                jq(letter).removeClass(validClass);
            }

            let caps = /[A-Z]/g;
            if (pwdInp.value.match(caps)) {
                jq(capital).removeClass(invalidClass);
                jq(capital).addClass(validClass);
            } else {
                jq(capital).addClass(invalidClass);
                jq(capital).removeClass(validClass);
            }

            let nums = /[0-9]/g;
            if (pwdInp.value.match(nums)) {
                jq(number).removeClass(invalidClass);
                jq(number).addClass(validClass);
            } else {
                jq(number).addClass(invalidClass);
                jq(number).removeClass(validClass);
            }

            if (pwdInp.value.length >= 8) {
                jq(length).removeClass(invalidClass);
                jq(length).addClass(validClass);
            } else {
                jq(length).addClass(invalidClass);
                jq(length).removeClass(validClass);
            }

            const pwdVal: string = pwdInp.value;
            valid =
                pwdVal.match(lows) &&
                pwdVal.match(caps) &&
                pwdVal.match(nums) &&
                pwdVal.length >= 8;
                // console.log({valid});
            // if (pwdValid) jq(".pwd-val").hide();
        };
        checkPass();
        pwdInp.onkeyup = checkPass;
    });
</script>

<div bind:this={parent}>
    <UInput
        type={passType}
        {...props}
        bind:value
        pattern={passPattern.source}
        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
    >
        {#snippet trailing()}
            {#if passType == "password"}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <span
                    onclick={() => {
                        passType = "text";
                    }}
                    class="btn-none"
                    title="show password"
                >
                    <i class="fi fi-rr-eye"></i>
                </span>
            {:else}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <span
                    class="btn-none"
                    onclick={() => {
                        passType = "password";
                    }}
                    title="hide password"
                >
                    <i class="fi fi-rr-eye-crossed"></i>
                </span>
            {/if}
        {/snippet}
    </UInput>

    <div
        bind:this={validationCont}
        class={"pwd-val form-group my-2 ml-2 text-center " + ((!showValidation || valid) && 'hidden')}
    >
        <p class="fs-12">
            Must contain{" "}
            <span class={"val-letter" + ` fw-5 ${invalidClass}`}>
                a lowercase
            </span>
            ,{" "}
            <span class={"val-cap" + ` fw-5 ${invalidClass}`}>
                an uppercase
            </span>
            ,{" "}
            <span class={"val-num" + ` fw-5 ${invalidClass}`}> a number </span>
            , and{" "}
            <span class={"val-len" + ` fw-5 ${invalidClass}`}>
                at least 8 characters
            </span>
        </p>
    </div>
</div>
