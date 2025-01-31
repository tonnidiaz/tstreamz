<script lang="ts">
    
    import { onMount } from "svelte";
    import {handleErrs} from '@repo/common/src/utils/funcs'
    import axios, { type AxiosInstance } from "axios";
    import { dev } from "$app/environment";
    import { requestOTP } from "../lib/funcs";
    import OtpText from "./OTPText.svelte";
    import UButton from "./UButton.svelte";
    import UFormGroup from "./UFormGroup.svelte";
    import UInput from "./UInput.svelte";
    
    const MAX = dev ? 10 : 60;
    let min = $state(MAX);

    interface IProps {
        email: string;
        user: string;
        value: any;
        action?: string;
        api: AxiosInstance
    }
    let { email, user, value = $bindable(), action, api }: IProps = $props();

    function startTimer() {
        min = MAX;
        const int = setInterval(() => {
            min -= 1;
            if (min <= 0) clearInterval(int);
        }, 1000);
    }

    async function _requestOTP(e: any) {
        try {
            if (dev) console.log({ user, action });
            const r = await requestOTP({ user, action, api });
            startTimer();
        } catch (err) {
            handleErrs(err);
            alert("Failed to request OTP");
        }
    }
    onMount(() => {
        startTimer();
        return () => (min = MAX);
    });
</script>

<OtpText {email} />
<UFormGroup>
    <UInput
        minlength={4}
        maxlength={4}
        inputClass="t-c"
        placeholder="****"
        required
        bind:value
    />
</UFormGroup>
<div class={`m-auto ${min > 0 ? "disabled" : ""}`}>
    <UButton class="btn-none fs-13" onclick={_requestOTP}>
        <span class="text-primary">Resend OTP</span>
        {#if min > 0}
            <span>{" "}in {min}s</span>
        {/if}
    </UButton>
</div>
