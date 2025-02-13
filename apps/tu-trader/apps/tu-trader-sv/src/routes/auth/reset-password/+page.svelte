<script lang="ts">
    import TMeta from "@/components/TMeta.svelte";

    import { SITE } from "@/lib/constants";
    import type { IObj } from "@cmn/utils/interfaces";
    import TuLink from "@repo/ui-sv/components/TuLink.svelte";
    import UButton from "@repo/ui-sv/components/UButton.svelte";
    import UForm from "@repo/ui-sv/components/UForm.svelte";
    import UFormGroup from "@repo/ui-sv/components/UFormGroup.svelte";
    import UInput from "@repo/ui-sv/components/UInput.svelte";
    import { handleErrs, isTuError } from "@cmn/utils/funcs";
    import TuPassField from "@repo/ui-sv/components/TuPassField.svelte";
    import { localApi } from "@/lib/api";
    import OtpField from "@repo/ui-sv/components/OTPField.svelte";
    import { setUser } from "@/stores/user.svelte";
    import { logout } from "@cmn/utils/funcs-ui";
    import { requestOTP, verifyOTP } from "@cmn/utils/funcs3";

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
                await requestOTP({user: formState.email, api: localApi})
                step += 1
            }else if (step == 1){
                // Verify OTP
                const r = await verifyOTP({user: formState.email, value: formState.otp, api: localApi})
                user = r
                step += 1
            }else{
                await localApi.post(`/user/${user._id}/update?f=info&token=${user.token}`, {newPwd: formState.pwd})
                // Create new password
                logout('/auth/login', setUser)
            }
        } catch (e: any) {
            handleErrs(e);
            const _err = isTuError(e) || "Something went wrong";
            setErr(_err);
        }
    };
</script>

<div class="flex items-center justify-center h-100p w-100p">
    <TMeta title={`Reset password - ${SITE}`} desc={`Reset your password if you have forgotten it.`}/>
    <div>
        <UForm state={formState} onsubmit={submitForm} autocomplete="on">
            <fieldset class="formset m-auto border-card border-1 p-4 pb-4">
                <legend class="text-primary text-xl text-cente"
                    ><TuLink to="/">{SITE}</TuLink></legend
                >
                <h2 class="text-cente mb-2 text-center fw-6">Reset password</h2>
                <div class="w-100p flex flex-col gap-2">
                    {#if step == 0}
                        <UFormGroup label="Email">
                            <UInput
                                type="email"
                                placeholder="Enter your email..."
                                autocomplete="email"
                                name="email"
                                required
                                bind:value={formState.email}
                            />
                        </UFormGroup>
                    {:else if step == 1}
                        <OtpField email={formState.email} user={formState.email} bind:value={formState.otp} api={localApi}/>
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
                    <div class="my-1 text-center fs-13">
                        <TuLink
                            to="/auth/login"
                            class="text-primary text-center"
                        >
                            Back to login
                        </TuLink>
                    </div>
                </div>
            </fieldset>
        </UForm>
    </div>
</div>
