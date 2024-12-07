<script lang="ts">
    import { goto } from "$app/navigation";

    import TMeta from "@/components/TMeta.svelte";
    import { localApi } from "@/lib/api";
    import { setUser, userStore } from "@/stores/user.svelte";
    import { handleErrs } from "@cmn/utils/funcs";
    import { isTuError } from "@cmn/utils/funcs2";
    import type { IObj } from "@cmn/utils/interfaces";
    import UButton from "@repo/ui/components/UButton.svelte";
    import UForm from "@repo/ui/components/UForm.svelte";
    import UFormGroup from "@repo/ui/components/UFormGroup.svelte";
    import UInput from "@repo/ui/components/UInput.svelte";
    import { onMount } from "svelte";

    let { user } = $derived(userStore);
    let formState = $state<IObj>({}),
        err = $state("");

    const saveChanges = async (e) => {
        try {
            const res = await localApi.post(`/user/${user._id}/update?f=info`, formState)
            setUser(res.data)
            alert("User details updated")
        } catch (er) {
            err = isTuError(er) || "Failed to update details"
            handleErrs(er)
        }
    };
    const delAccount = async (e) => {
        const conf = confirm('Are you sure you want to delete your account?')
        if (!conf) return
        const btn = e.currentTarget
        try {
            
            btn.disabled = true
            const res = await localApi.post(`/user/${user._id}/delete`)
            setUser(res.data)
            window.location.href = '/auth/logout'
        } catch (er) {
            err = isTuError(er) || "Failed to delete account"
            handleErrs(er)
        }finally{btn.disabled = false}
    };
    onMount(() => {
        if (!user?.username) {
            goto(`/auth/login?red=${location.pathname}`);
        }
        formState = { ...user };
    });
</script>

<div class="body">
    <TMeta title="My Profile - TunedStreamz" />

    <div class="mt-40 p-2 br-3">
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

                    <div class="grid grid-cols-2 gap-2">
                        <UButton type="submit" class="btn-primary"
                            >Save changes</UButton
                        >
                        <UButton type="button" class="btn-error" onclick={delAccount}
                            >Delete account</UButton
                        >
                    </div>
                </div>
            </fieldset>
        </UForm>
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
