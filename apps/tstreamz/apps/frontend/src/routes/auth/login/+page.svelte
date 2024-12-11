<script lang="ts">
    import TMeta from "@/components/TMeta.svelte";

    import { localApi } from "@/lib/api";
    import { STORAGE_KEYS, SITE } from "@/lib/constants";
    import { setUser } from "@/stores/user.svelte";
    import type { IObj } from "@cmn/utils/interfaces";
    import { page } from "$app/stores";
    import TuLink from "@repo/ui/components/TuLink.svelte";
    import UButton from "@repo/ui/components/UButton.svelte";
    import UForm from "@repo/ui/components/UForm.svelte";
    import UFormGroup from "@repo/ui/components/UFormGroup.svelte";
    import UInput from "@repo/ui/components/UInput.svelte";
    import { handleErrs } from "@cmn/utils/funcs";
    import TuPassField from "@repo/ui/components/TuPassField.svelte";
    import { isTuError } from "@cmn/utils/funcs2";

    let btnDisabled = $state(false),
        setBtnDisabled = (v: boolean) => (btnDisabled = v);
    let passType = $state<"password" | "text">("password"),
        err = $state(""),
        setPassType = (v: typeof passType) => (passType = v),
        setErr = (v: string) => (err = v);

    let formState = $state<IObj>({});

    const submitForm = async (e: any) => {
        e.preventDefault()
        try {
            setErr("");

            const formData = formState;
            const res = await localApi.post("/auth/login", formData);
            setUser(res.data.user);
            localStorage.setItem(STORAGE_KEYS.authTkn, res.data.token);
    
            const red = $page.url.searchParams.get("red");
            location.href = red || "/";
        } catch (e: any) {
            handleErrs(e);
            const _err = isTuError(e) || "Something went wrong";
            setErr(_err);
        }
    };
</script>

<div class="flex items-center justify-center h-100p w-100p">
    <TMeta title={`Login - ${SITE}`} desc="Signin to your account."/>
    <div >
        <UForm state={formState} onsubmit={submitForm}>
            <fieldset class="formset m-auto border-card border-1 p-4 pb-4">
                <legend class="text-primary text-xl text-cente"
                    ><TuLink to="/">{SITE}</TuLink></legend
                >
                <h2 class="text-cente mb-2 text-center fw-6">Login to your account</h2>
                <div class="w-100p flex flex-col gap-2">
                    <UFormGroup label="Email/Username">
                        <UInput
                            placeholder="Enter email or username..."
                            required
                            bind:value={formState.username}
                        />
                    </UFormGroup>
                    <UFormGroup label="Password">
                        <TuPassField showValidation={false} required bind:value={formState.password} placeholder="Enter password..."/>
                    </UFormGroup>
                    {#if err.length}
                        <div
                            class="ml-2 text-whit fs-12 text-center text-error"
                        >
                            <p>{err?.replace("tuned:", "")}</p>
                        </div>
                    {/if}
                    <div class="fs-12 mt-1 ml-1 text-center">
                        <TuLink
                            to="/auth/reset-password"
                            class="text-primary text-center"
                        >
                            Forgot password?
                        </TuLink>
                    </div>
                    <UFormGroup class="mt-1">
                        <UButton
                            disabled={!formState.username?.length ||
                                !formState.password?.length}
                            class="w-full btn-primary"
                            type="submit">Login</UButton
                        >
                    </UFormGroup>
                    <UFormGroup>
                        <p class="fs-14 text-center">
                            Or <TuLink class="text-primary" to="/auth/signup"
                                >Create account</TuLink
                            >
                        </p>
                    </UFormGroup>
                </div>
            </fieldset>
        </UForm>
    </div>
</div>
