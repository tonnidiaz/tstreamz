<script lang="ts">
    import { dev } from "$app/environment";
    import { requestOTP } from "@/lib/funcs";
    import { handleErrs } from "@cmn/utils/funcs";
    import OtpText from "@repo/ui-sv/components/OTPText.svelte";
    import UButton from "@repo/ui-sv/components/UButton.svelte";
    import UFormGroup from "@repo/ui-sv/components/UFormGroup.svelte";
    import UInput from "@repo/ui-sv/components/UInput.svelte";
    import { onMount } from "svelte";

    const MAX = dev ? 10 : 60;
    let min = $state(MAX);

    interface IProps {
        email: string;
        user: string;
        value: any;
        action?: string;
    }
    let { email, user, value = $bindable(), action }: IProps = $props();

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
            const r = await requestOTP({ user, action });
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
