<script lang="ts">
    import TMeta from "@/components/TMeta.svelte";

    import { SITE } from "@/lib/constants";
    import type { IObj } from "@cmn/utils/interfaces";
    import TuLink from "@repo/ui/components/TuLink.svelte";
    import UButton from "@repo/ui/components/UButton.svelte";
    import UForm from "@repo/ui/components/UForm.svelte";
    import UFormGroup from "@repo/ui/components/UFormGroup.svelte";
    import UInput from "@repo/ui/components/UInput.svelte";
    import { handleErrs } from "@cmn/utils/funcs";
    import TuPassField from "@repo/ui/components/TuPassField.svelte";
    import { isTuError } from "@cmn/utils/funcs2";
    import OtpText from "@repo/ui/components/OTPText.svelte";
    import { logout, requestOTP, verifyOTP } from "@/lib/funcs";
    import OtpField from "@/components/OTPField.svelte";
    import { localApi } from "@/lib/api";

    let err = $state(""),
        setErr = (v: string) => (err = v);
    let step = $state(0);
    let formState = $state<IObj>({});
    let user = $state<IObj>({})

    const submitForm = async (e: any) => {
        e.preventDefault();
        try {
            setErr("");

            if (step == 0){
                // Request OTP
                await requestOTP({user: formState.email})
                step += 1
            }else if (step == 1){
                // Verify OTP
                const r = await verifyOTP({user: formState.email, value: formState.otp})
                user = r
                step += 1
            }else{
                await localApi.post(`/user/${user._id}/update?f=info&token=${user.token}`, {newPwd: formState.pwd})
                // Create new password
                logout('/auth/login')
            }
        } catch (e: any) {
            handleErrs(e);
            const _err = isTuError(e) || "Something went wrong";
            setErr(_err);
        }
    };
</script>

<div class="flex items-center justify-center h-100p w-100p">
    <TMeta title={`Reset password - ${SITE}`} />
    <div>
        <UForm state={formState} onsubmit={submitForm}>
            <fieldset class="formset m-auto border-card border-1 p-4 pb-4">
                <legend class="text-primary text-xl text-cente"
                    ><TuLink to="/">{SITE}</TuLink></legend
                >
                <h2 class="text-cente my-3 fw-6">Reset password</h2>
                <div class="w-100p flex flex-col gap-2">
                    {#if step == 0}
                        <UFormGroup label="Email">
                            <UInput
                                type="email"
                                placeholder="Enter your email..."
                                required
                                bind:value={formState.email}
                            />
                        </UFormGroup>
                    {:else if step == 1}
                        <OtpField email={formState.email} user={formState.email} bind:value={formState.otp}/>
                        {:else if step == 2}
                            <UFormGroup label="New password">
                                <TuPassField required showValidation placeholder="Enter new password..." bind:value={formState.pwd}/>
                            </UFormGroup>
                            <UFormGroup label="Confirm password">
                                <TuPassField required showValidation={false} placeholder="Re-enter password..." bind:value={formState.cpwd}/>
                            </UFormGroup>
                    {/if}

                    {#if err}
                        <div
                            class="ml-2 text-whit fs-12 text-center text-error"
                        >
                            <p>{err?.replace("tuned:", "")}</p>
                        </div>
                    {/if}

                    <UFormGroup class="mt-1">
                        <UButton disabled={step == 2 && (formState.pwd != formState.cpwd)} class="w-full btn-primary" type="submit"
                            >Submit</UButton
                        >
                    </UFormGroup>
                </div>
            </fieldset>
        </UForm>
    </div>
</div>
