<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    import TMeta from "@/components/TMeta.svelte";
    import { localApi } from "@/lib/api";
    import { setUser, userStore } from "@/stores/user.svelte";
    import { handleErrs, sleep } from "@cmn/utils/funcs";
    import { isTuError } from "@cmn/utils/funcs2";
    import type { IObj } from "@cmn/utils/interfaces";
    import TuModal from "@repo/ui/components/TuModal.svelte";
    import TuPassField from "@repo/ui/components/TuPassField.svelte";
    import TuTabItem from "@repo/ui/components/TuTabItem.svelte";
    import TuTabs from "@repo/ui/components/TuTabs.svelte";
    import TuTabsCont from "@repo/ui/components/TuTabsCont.svelte";
    import UButton from "@repo/ui/components/UButton.svelte";
    import UForm from "@repo/ui/components/UForm.svelte";
    import UFormGroup from "@repo/ui/components/UFormGroup.svelte";
    import UInput from "@repo/ui/components/UInput.svelte";
    import { onMount } from "svelte";

    let { user } = $derived(userStore);
    let formState = $state<IObj>({}),
        err = $state("");

    let isUpdatingCreds = $derived(
        formState.newPwd ||
            formState.email != user.email ||
            formState.username != user.username
    );
    const saveChanges = async (e) => {
        console.log("saveChanges");
        try {
            await sleep(2000)
            console.log("Done");
            return
            const res = await localApi.post(
                `/user/${user._id}/update?f=info`,
                formState
            );
            err = "";
            setUser(res.data);

            alert("User details updated");
        } catch (er) {
            err = isTuError(er) || "Failed to update details";
            handleErrs(er);
        }
    };
    const delAccount = async (e) => {
        const conf = confirm("Are you sure you want to delete your account?");
        if (!conf) return;
        const btn = e.currentTarget;
        try {
            btn.disabled = true;
            const res = await localApi.post(`/user/${user._id}/delete`);
            err = "";
            setUser(res.data);
            window.location.href = "/auth/logout";
        } catch (er) {
            err = isTuError(er) || "Failed to delete account";
            handleErrs(er);
        } finally {
            btn.disabled = false;
        }
    };
    onMount(() => {
        if (!user?.username) {
            goto(`/auth/login?red=${location.pathname}`);
        }
        formState = { ...user };
        const hash = $page.url.hash?.toLowerCase?.();
        if (hash == "#settings") tab = 1;
    });

    let tab = $state(0);
</script>

<div class="body h-100p w-500px flex m-auto">
    <TMeta title="My Profile - TunedStreamz" />

    <div class="m-auto h-100p w-100p p-2 br-3">
        <!-- <TuTabsCont>
            <TuTabItem bind:tab i={0}>
                {#snippet label()}
                    Tab 1
                {/snippet}
                {#snippet content()}
                    Tab 1 content
                    <UInput placeholder="Enter name"/>
                {/snippet}
            </TuTabItem>
            <TuTabItem bind:tab i={1}>
                {#snippet label()}
                    Tab 2
                {/snippet}
                {#snippet content()}
                    Tab 2 content
                    <UInput placeholder="Enter name"/>
                {/snippet}
            </TuTabItem>
        </TuTabsCont> -->
        <div class="h-100p w-100p">
            <TuTabs bind:tab>
                {#snippet label()}
                    <a href="#profile" class="tab-label">Profile</a>
                    <a href="#settings" class="tab-label">Settings</a>
                {/snippet}
                {#snippet content()}
                    <div class="tab-cont mt-4">
                        <UForm id="profile-form" onsubmit={saveChanges}>
                            <fieldset class="formset m-auto fieldset">
                                <legend>My profile</legend>
                                <div>
                                    <p class="err t-c fs-12">{err}</p>
                                </div>
                                <div class="flex flex-col w-100p gap-3">
                                    <UFormGroup label="First name">
                                        <UInput
                                            placeholder="e.g. John"
                                            bind:value={formState.first_name}
                                        />
                                    </UFormGroup>
                                    <UFormGroup label="Last name">
                                        <UInput
                                            placeholder="e.g. Doe"
                                            bind:value={formState.last_name}
                                        />
                                    </UFormGroup>
                                    <UFormGroup label="Username">
                                        <UInput
                                            placeholder="Enter username..."
                                            required
                                            disabled
                                            bind:value={formState.username}
                                        />
                                    </UFormGroup>

                                    <UFormGroup label="Email address">
                                        <UInput
                                            placeholder="Enter your email..."
                                            required
                                            disabled
                                            bind:value={formState.email}
                                        />
                                    </UFormGroup>

                                    <div class="w-full">
                                        <UButton
                                            type="submit"
                                            class="btn-primary"
                                            >Save changes</UButton
                                        >
                                    </div>
                                </div>
                            </fieldset>
                        </UForm>
                    </div>
                    <div class="tab-cont mt-4">
                        <UForm id="setting-form" onsubmit={saveChanges}>
                            <fieldset class="formset m-auto fieldset">
                                <legend>Account settings</legend>
                                <div>
                                    <p class="err t-c fs-12">{err}</p>
                                </div>
                                <div class="flex flex-col w-100p gap-3">
                                    <UFormGroup label="Username">
                                        <UInput
                                            placeholder="Enter username..."
                                            required
                                            bind:value={formState.username}
                                        />
                                    </UFormGroup>

                                    <UFormGroup label="Email address">
                                        <UInput
                                            placeholder="Enter your email..."
                                            required
                                            bind:value={formState.email}
                                        />
                                    </UFormGroup>

                                    <UFormGroup label="New password">
                                        <TuPassField
                                            autocomplete="off"
                                            autocorrect="off"
                                            name="off"
                                            placeholder="Enter new password"
                                            bind:value={formState.newPwd}
                                        />
                                    </UFormGroup>

                                    <div class="w-full gap-2 grid grid-cols-2">
                                        <TuModal>
                                            {#snippet toggler()}
                                                <UButton
                                                    type="button"
                                                    class="btn-primary"
                                                    disabled={!isUpdatingCreds}
                                                    >Save changes</UButton
                                                >
                                            {/snippet}
                                            {#snippet content()}
                                                <UForm onsubmit={saveChanges}
                                                    class="flex flex-col gap-2"
                                                >
                                                    <UFormGroup
                                                        label="Password"
                                                    >
                                                        <TuPassField
                                                            showValidation={false}
                                                            placeholder="Enter your password..."
                                                            required={isUpdatingCreds}
                                                            bind:value={formState.pwd}
                                                        />
                                                    </UFormGroup>
                                                    <UButton
                                                        type="submit"
                                                        class="btn-primary btn-progress mt-1 w-150px"
                                                        
                                                        >Submit</UButton
                                                    >
                                                </UForm>
                                            {/snippet}
                                        </TuModal>

                                        <UButton
                                            type="button"
                                            class="btn-error"
                                            onclick={delAccount}
                                            >Delete account</UButton
                                        >
                                    </div>
                                </div>
                            </fieldset>
                        </UForm>
                    </div>
                {/snippet}
            </TuTabs>
        </div>
    </div>

    <!-- <Dialog :onOk="onOk" title="Enter your password to proceed" :onCancel="()=> showDialog = false" v-if="showDialog">
              <div class="form-group">
                <label style="font-weight: 500;" class="fs-16" htmlFor="pass">
                  Password:
                </label>
                <input
                  placeholder="Enter password..."
                  class="form-"
                  type="password"
                  @change="(e: any)=> pswd = e.target.value"
                  id="pass"
                  name="pass"
                  required
                />
              </div>

          </Dialog>

          <Toast :txt="toastTxt" v-if="showToast"/> -->
</div>
