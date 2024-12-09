<script lang="ts">
    import type { IObj } from "@cmn/utils/interfaces";
    import { onMount, untrack } from "svelte";
    import jq from "jquery";
    import { localApi } from "@/lib/api";
    import { setUser } from "@/stores/user.svelte";
    import { SITE, STORAGE_KEYS } from "@/lib/constants";
    import UInput from "@repo/ui/components/UInput.svelte";
    import TuLink from "@repo/ui/components/TuLink.svelte";
    import UButton from "@repo/ui/components/UButton.svelte";
    import UForm from "@repo/ui/components/UForm.svelte";
    import TMeta from "@/components/TMeta.svelte";
    import UFormGroup from "@repo/ui/components/UFormGroup.svelte";
    import { handleErrs, sleep } from "@cmn/utils/funcs";
    import TuPassField from "@repo/ui/components/TuPassField.svelte";
    import { isTuError } from "@cmn/utils/funcs2";
    let btnDisabled = $state(true),
        pwdValid = $state(false),
        err = $state(""),
        formData = $state<IObj>({}),
        step = $state(0);
    const passPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    let formRef: HTMLDivElement;

    const submitOTP = async (e: any) => {
        e.preventDefault();
        
        try {
            err = "";
            const res = await localApi.post("/auth/verify-email", formData);
            const { user, token } = res.data;

            setUser(user);
            localStorage.setItem(STORAGE_KEYS.authTkn, token);
            location.href = "/me/profile";
        } catch (e: any) {
            handleErrs(e);
            const _err = isTuError(e)
                 || "Something went wrong";
            err = _err;
        }
    };

    const submitForm = async (e: any) => {
        try {
            e.preventDefault();
            const form = e.target;
            err = "";
            console.log("Signing up...");
            const res = await localApi.post(
                "/auth/signup?method=custom",
                formData
            );
            const { id } = res.data;
            step = 1;
        } catch (e) {
            handleErrs(e);
            err = isTuError(e) || "Something went wrong"
        }
    };

    $effect(() => {
        // watch formstate
        const { email, username } = formData;
        const _pwdValid = pwdValid;
        untrack(() => {
            btnDisabled = !(email && username && _pwdValid);
        });
    });
</script>

<div class="flex items-center justify-center w-100p h-100p">
    <TMeta title={`Signup - ${SITE}`} />
    {#if step == 0}
        <div bind:this={formRef}>
            <UForm onsubmit={submitForm} id="su-form" autocomplete="off">
                <fieldset class="formset m-auto border-card border-1 p-4 pb-4">
                    <legend class="text-primary"
                        ><TuLink to="/">{SITE}</TuLink></legend
                    >
                    <h2 class="text-cente my-3 fw-6">Sign up</h2>
                    <div class="w-100p flex flex-col gap-2">
                        <UFormGroup label="Username">
                            <UInput
                                type="text"
                                name="username"
                                required
                                class=""
                                bind:value={formData.username}
                                placeholder="e.g. johndoe"
                            />
                        </UFormGroup>
                        <UFormGroup label="Email">
                            <UInput
                                type="email"
                                name="email"
                                bind:value={formData.email}
                                required
                                placeholder="e.g. johndoe@gmail.com"
                            />
                        </UFormGroup>
                        <UFormGroup label="Password">
                            <TuPassField
                                bind:valid={pwdValid}
                                bind:value={formData.password}
                                name="password"
                                required
                                placeholder="Enter password"
                            />
                        </UFormGroup>

                        {#if err?.length}
                            <div
                                class="mt-2 ml-2 text-whit fs-12 text-center text-error"
                            >
                                <p>{err?.replace("tu:", "")}</p>
                            </div>{/if}
                        <div class="mt-2 form-group">
                            <UButton
                                type="submit"
                                disabled={btnDisabled}
                                id="su-btn"
                                class="su-btn btn-primary w-100p"
                            >
                                Sign up
                            </UButton>
                        </div>
                        <div class="form-group text-center mt-3 fs-14">
                            <p>
                                Already have an account?{" "}
                                <TuLink to="/auth/login" class="text-primary">
                                    Login
                                </TuLink>
                            </p>
                        </div>
                    </div>
                </fieldset>
            </UForm>
        </div>
    {:else}
        <UForm onsubmit={submitOTP}>
            <fieldset class="formset m-auto border-card border-1 px-5 pb-5">
                <legend class="flex items-center gap-2">
                    <UButton
                        onclick={() => (step = 0)}
                        type="button"
                        class="mt-1"
                        ><i class="fi fi-br-arrow-left"></i></UButton
                    >
                    <div>{SITE} auth</div></legend
                >
                <p class="text-center fs-13 mb-3">
                    Enter the 4-digit PIN sent to{" "}
                    <span class="text-primary">
                        {formData.email}
                    </span>
                </p>
                <UFormGroup>
                    <UInput
                        type="text"
                        placeholder="Enter OTP"
                        maxlength={4}
                        minlength={4}
                        inputClass="text-center"
                        required
                        bind:value={formData.otp}
                        
                    />
                </UFormGroup>
                {#if err}
                    <p class="mt-2 ml-2 text-error fs-12 text-center">
                        {err?.replace("tu:", "")}
                    </p>{/if}
                <div class="my-2">
                    <UButton
                        type="submit"
                        disabled={formData.otp?.length < 4 || btnDisabled}
                        class="w-100p btn btn-primary"
                    >
                        Submit
                    </UButton>
                </div>
            </fieldset>
        </UForm>
    {/if}
</div>
