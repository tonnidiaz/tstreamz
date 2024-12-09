<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    import TMeta from "@/components/TMeta.svelte";
    import { localApi } from "@/lib/api";
    import { requestOTP } from "@/lib/funcs";
    import { setUser, userStore } from "@/stores/user.svelte";
    import { handleErrs } from "@cmn/utils/funcs";
    import { isTuError } from "@cmn/utils/funcs2";
    import type { IObj } from "@cmn/utils/interfaces";
    import TuModal from "@repo/ui/components/TuModal.svelte";
    import TuPassField from "@repo/ui/components/TuPassField.svelte";
    import TuTabs from "@repo/ui/components/TuTabs.svelte";
    import UButton from "@repo/ui/components/UButton.svelte";
    import UForm from "@repo/ui/components/UForm.svelte";
    import UFormGroup from "@repo/ui/components/UFormGroup.svelte";
    import UInput from "@repo/ui/components/UInput.svelte";
    import { onMount, untrack } from "svelte";

    let { user } = $derived(userStore);
    let formState = $state<IObj>({}),
        err = $state(""),
        settingsStep = $state(0),
        passwordModalOpen = $state(false);

        let emailModalOpen = $state(false)
    let isUpdatingCreds = $derived(
        formState.newPwd ||
            formState.email != user.email ||
            formState.username != user.username
    );

    let interceptorCb: Function;

    const openPwdModal = (cb: Function) => {
        err = ""
        settingsStep = 0
        formState.otp = undefined
        formState.pwd = undefined
        passwordModalOpen = true; interceptorCb = cb
    }

    const openEmailModal = ()=>{
        interceptorCb = ()=>{
            setUser({...user, email: formState.email})
        }
        emailModalOpen = true}

    const interceptor = async(e, newEmail?: string)=>{
        try{
        e.preventDefault()
        err = ""
        if (settingsStep == 0) {
            const pwdValid = await verifyPwd(!newEmail);
            if (pwdValid) {
                if (newEmail){
                    const r = await requestOTP({user: user._id, newEmail})
                    if (!r) {
                        err = "Failed to request OTP"
                        return}
                }
                settingsStep = 1;
            }
            return;
        
        }
        const otpValid = await verifyOTP(newEmail)
        if (!otpValid) return;
        formState.otp = undefined
        await interceptorCb?.()
        return true
    }catch(err){
        handleErrs(err)
        err = isTuError(err) || 'Something went wrong'
    }
    }
    const saveChanges = async (e) => {
        
        // if (!await interceptor()) return
        console.log("saveChanges");
        try {
            err = "";
            const res = await localApi.post(
                `/user/${user._id}/update?f=info`,
                formState
            );

            setUser(res.data);
            passwordModalOpen = false;
            formState.newPwd = undefined
            alert("User details updated");
        } catch (er) {
            err = isTuError(er) || "Failed to update details";
            handleErrs(er);
           
        }finally{
             settingsStep =0
        }
    };

    const verifyPwd = async (sendPin = true) => {
        try {
            const res = await localApi.post("/auth/verify-pwd", {
                user: user._id,
                value: formState.pwd,
                sendPin
            });
            return true;
        } catch (er) {
            err = isTuError(er) || "Failed to verify password";
            handleErrs(er);
            return false;
        }
    };
    
    const verifyOTP = async (newEmail?: string) => {
        try {
            const res = await localApi.post("/auth/otp/verify", {
                user: user._id,
                value: formState.otp,
                newEmail
            });
            return true;
        } catch (er) {
            err = isTuError(er) || "Failed to verify OTP";
            handleErrs(er);
            return false;
        }
    };

    const delAccount = async (e) => {
       
        // if (!await interceptor()) return;
        try {
            const res = await localApi.post(`/user/${user._id}/delete`);
            err = "";
            setUser(res.data);
            window.location.href = "/auth/logout";
        } catch (er) {
            err = isTuError(er) || "Failed to delete account";
            handleErrs(er);
            
        } finally {
            settingsStep = 0
            
        }
    };
    onMount(() => {
        if (!user?.username) {
            goto(`/auth/login?red=${location.pathname}`);
        }
        formState = { username: user.username};
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
                        <UForm id="setting-form" onsubmit={(e)=> e.preventDefault()} autocomplete="off">
                            <fieldset class="formset m-auto fieldset">
                                <legend>Account settings</legend>

                                <div class="flex flex-col w-100p gap-3">
                                    <UFormGroup label="Username">
                                        <UInput
                                            placeholder="Enter username..."
                                            required
                                            name="username"
                                            bind:value={formState.username}
                                        />
                                    </UFormGroup>

                                    <UFormGroup label="Email address">
                                        <div class="flex gap-2 justify-between"><UInput
                                            placeholder="Enter your email..."
                                            disabled
                                            name="email"
                                            bind:value={user.email}
                                        />
                                        <button onclick={openEmailModal} aria-label="change email" type="button" class="btn-outline btn-sm fs-12 btn text-primary"><i class="fi fi-br-pencil"></i></button></div>
                                        
                                    </UFormGroup>
                                    
                                    <UFormGroup label="New password">
                                        <TuPassField
                                            autocomplete="new-password"
                                            name="unlocker"
                                            
                                            placeholder="Enter new password"
                                            bind:value={formState.newPwd}
                                        ></TuPassField>
                                    </UFormGroup>

                                    <div class="w-full gap-2 grid grid-cols-2">
                                        <UButton
                                                    type="button"
                                                    class="btn-primary"
                                                    disabled={!isUpdatingCreds}
                                                    onclick={e=> openPwdModal(async ()=>await saveChanges(e)) }
                                                    >Save changes</UButton
                                                >
                                        

                                        <UButton
                                            type="button"
                                            class="btn-error"
                                            onclick={(e) => openPwdModal(async ()=>await delAccount(e))}
                                            >Delete account</UButton
                                        >
                                    </div>
                                </div>
                            </fieldset>
                        </UForm>
                    </div>
                {/snippet}
            </TuTabs>
            <TuModal bind:open={passwordModalOpen}>
                                            
                {#snippet content()}
                    <UForm
                        onsubmit={interceptor}
                        class="flex flex-col gap-2"
                    >
                        {#if settingsStep == 0}
                            <UFormGroup
                                label="Password"
                            >
                                <TuPassField
                                    showValidation={false}
                                    placeholder="Enter your password..."
                                    required
                                    autocomplete="current-password"
                                    bind:value={formState.pwd}
                                />
                            </UFormGroup>
                        {:else}
                        <p class="text-center fs-12">Enter the 4-didit one-time-pin sent to <span class="text-primary fw-6">{user.email}</span></p>
                            <UFormGroup>
                                <UInput
                                    inputClass="text-center"
                                    minlength={4}
                                    maxlength={4}
                                    required
                                    class="w-150px m-auto"
                                    bind:value={formState.otp}
                                    placeholder="****"
                                />
                            </UFormGroup>
                        {/if}

                        {#if err}
                            <p
                                class="err t-c fs-12"
                            >
                                {err}
                            </p>
                        {/if}

                        <UButton
                            type="submit"
                            class="btn-primary btn-progress mt-1 ml-auto w-150px"
                            >Submit</UButton
                        >
                    </UForm>
                {/snippet}
            </TuModal>

            <TuModal bind:open={emailModalOpen}>
                                            
                {#snippet content()}
                    <UForm
                        onsubmit={async(e)=> await interceptor(e, formState.email)}
                        class="flex flex-col gap-2"
                    >
                        {#if settingsStep == 0}
                            <UFormGroup
                                label="New email"
                            >
                                <UInput
                                    placeholder="Enter new email address..."
                                    required
                                    type="email"
                                    name="nmn"
                                    autocomplete="off"
                                    bind:value={formState.email}
                                />
                            </UFormGroup>
                            <UFormGroup
                                label="Password"
                            >
                                <TuPassField
                                    showValidation={false}
                                    placeholder="Enter your password..."
                                    required
                                    autocomplete="new-password"
                                    bind:value={formState.pwd}
                                />
                            </UFormGroup>
                        {:else}
                        <p class="text-center fs-12">Enter the 4-didit one-time-pin sent to <span class="text-primary fw-6">{user.email}</span></p>
                            <UFormGroup>
                                <UInput
                                    inputClass="text-center"
                                    minlength={4}
                                    maxlength={4}
                                    required
                                    class="w-150px m-auto"
                                    bind:value={formState.otp}
                                    placeholder="****"
                                />
                            </UFormGroup>
                        {/if}

                        {#if err}
                            <p
                                class="err t-c fs-12"
                            >
                                {err}
                            </p>
                        {/if}

                        <UButton
                            type="submit"
                            class="btn-primary btn-progress mt-1 ml-auto w-150px"
                            >Submit</UButton
                        >
                    </UForm>
                {/snippet}
            </TuModal>
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
