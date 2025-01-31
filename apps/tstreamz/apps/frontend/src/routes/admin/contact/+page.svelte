<script lang="ts">
    import TMeta from "@/components/TMeta.svelte";

    import { localApi } from "@/lib/api";
    import { STORAGE_KEYS, SITE } from "@/lib/constants";
    import { setUser } from "@/stores/user.svelte";
    import type { IObj } from "@cmn/utils/interfaces";
    import { page } from "$app/stores";
    import TuLink from "@repo/ui-sv/components/TuLink.svelte";
    import UButton from "@repo/ui-sv/components/UButton.svelte";
    import UForm from "@repo/ui-sv/components/UForm.svelte";
    import UFormGroup from "@repo/ui-sv/components/UFormGroup.svelte";
    import UInput from "@repo/ui-sv/components/UInput.svelte";
    import { handleErrs } from "@cmn/utils/funcs";
    import TuPassField from "@repo/ui-sv/components/TuPassField.svelte";
    import { isTuError } from "@cmn/utils/funcs2";
    import UCheckbox from "@repo/ui-sv/components/UCheckbox.svelte";
    import UTextarea from "@repo/ui-sv/components/UTextarea.svelte";

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
            const res = await localApi.post("/admin/message/send", formData);
            alert("Message sent successfully")
        } catch (e: any) {
            handleErrs(e);
            const _err = isTuError(e) || "Something went wrong";
            setErr(_err);
        }
    };

    async function getAllUsers(){
        try {
            const r = await localApi.get("/users?f=email")
            formState.emails = r.data.join(",")
        } catch (err) {
            handleErrs(err)
            
        }
    }
    $effect(()=>{
        if (formState.all){
            getAllUsers()
        }
    })
</script>

<div class="flex items-center justify-center h-100p w-100p">
    <TMeta title={`Admin:contact - ${SITE}`} desc="Contact users." />
    <div>
        <UForm state={formState} onsubmit={submitForm} autocomplete="on">
            <fieldset class="formset m-auto border-card border-1 p-4 pb-4">
                <legend class="text-primary text-xl text-cente"
                    ><TuLink to="/">{SITE}</TuLink></legend
                >
                <h2 class="text-cente mb-2 text-center fw-6">Contact users</h2>
                <div class="w-100p flex flex-col gap-2">
                    <UFormGroup label="Subject">
                        <UInput required placeholder="Enter subject..." bind:value={formState.subject}/>
                    </UFormGroup>
                    <UFormGroup label="Heading">
                        <UInput placeholder="Enter heading..." bind:value={formState.heading}/>
                    </UFormGroup>
                    <UFormGroup label="Email address(s)">
                        <UTextarea style="resize: vertical"
                            placeholder="Enter email(s)..."
                            required
                            name="email"
                            bind:value={formState.emails}
                        />
                        <UCheckbox
                            bind:value={formState.all}
                            label="All users"
                        />
                    </UFormGroup>
                    <UFormGroup label="Messege(html)">
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
                        <UButton
                            
                            class="w-full btn-primary"
                            type="submit">Submit</UButton
                        >
                    </UFormGroup>
                  
                </div>
            </fieldset>
        </UForm>
    </div>
</div>
