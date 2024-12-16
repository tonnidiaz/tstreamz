<script lang="ts">
    import TMeta from "@/components/TMeta.svelte";

    import { api } from "@/lib/api";
    import { SITE } from "@/lib/constants";
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
    import UCheckbox from "@repo/ui/components/UCheckbox.svelte";
    import UTextarea from "@repo/ui/components/UTextarea.svelte";

    let btnDisabled = $state(false),
        setBtnDisabled = (v: boolean) => (btnDisabled = v);
    let passType = $state<"password" | "text">("password"),
        err = $state(""),
        setPassType = (v: typeof passType) => (passType = v),
        setErr = (v: string) => (err = v);

    let formState = $state<IObj>({});

    const submitForm = async (e: any) => {
        e.preventDefault();
        try {
            setErr("");

            const formData = formState;
            const res = await api.post("/message/send", {
                ...formData,
                app: SITE,
                subject: `${SITE} contact us message`
            });
            alert("Message sent successfully");
        } catch (e: any) {
            handleErrs(e);
            const _err = isTuError(e) || "Something went wrong";
            setErr(_err);
        }
    };
</script>

<div class="flex items-center justify-center h-100p w-100p">
    <TMeta title={`Contact us - ${SITE}`} desc="Contact us." />
    <div>
        <UForm state={formState} onsubmit={submitForm} autocomplete="on">
            <fieldset class="formset m-auto border-card border-1 p-4 pb-4">
                <legend class="text-primary text-xl text-cente"
                    ><TuLink to="/">{SITE}</TuLink></legend
                >
                <h2 class="text-cente mb-2 text-center fw-6">Contact us</h2>
                <div class="w-100p flex flex-col gap-2">
                    <UFormGroup label="Full name">
                        <UInput placeholder="e.g John Doe" required name="full-name"/>
                    </UFormGroup>
                    <UFormGroup label="Email address">
                        <UInput
                            style="resize: vertical"
                            placeholder="Enter your email..."
                            required
                            name="email"
                            type="email"
                            bind:value={formState.email}
                        />
                    </UFormGroup>
                    <UFormGroup label="Messege">
                        <UTextarea
                            style="resize: vertical"
                            name="msg"
                            required
                            bind:value={formState.msg}
                            placeholder="Enter message..."
                        />
                    </UFormGroup>
                    {#if err}
                        <div
                            class="ml-2 text-whit fs-12 text-center text-error"
                        >
                            <p>{err?.replace("tu:", "")}</p>
                        </div>
                    {/if}

                    <UFormGroup class="mt-1">
                        <UButton class="w-full btn-primary" type="submit"
                            >Submit</UButton
                        >
                    </UFormGroup>
                </div>
            </fieldset>
        </UForm>
    </div>
</div>
