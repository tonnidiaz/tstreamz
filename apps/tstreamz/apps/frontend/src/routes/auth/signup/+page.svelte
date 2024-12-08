<script lang="ts">
    import type { IObj } from "@cmn/utils/interfaces";
    import { onMount } from "svelte";
    import jq from "jquery"
    import { localApi } from "@/lib/api";
    import { setUser } from "@/stores/user.svelte";
    import { SITE, STORAGE_KEYS } from "@/lib/constants";
    import UInput from "@repo/ui/components/UInput.svelte";
    import TuLink from "@repo/ui/components/TuLink.svelte";
    import UButton from "@repo/ui/components/UButton.svelte";
    import UForm from "@repo/ui/components/UForm.svelte";
    import TMeta from "@/components/TMeta.svelte";
    import UFormGroup from "@repo/ui/components/UFormGroup.svelte";
    import { handleErrs } from "@cmn/utils/funcs";
    let pwd = $state("")
    let btnDisabled = $state(true),
        passType = $state<"text" | "password">("password"),
        err = $state(""),
        formData = $state<IObj>({}),
            step = $state(0);
            const passPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
    let formRef: HTMLDivElement;

    const submitOTP = async (e:any) => { 
        e.preventDefault()
        const form = e.target
        const btn: HTMLButtonElement = form.querySelector('button[type="submit"]')
        try{
            btn.textContent = "..."
            err = ("")
            btnDisabled = (true) 
            const res = await localApi.post('/auth/verify-email', formData)
            const { user, token} = res.data

            setUser(user)
            localStorage.setItem(STORAGE_KEYS.authTkn, token)

            setTimeout(()=>{btnDisabled = (false)}, 1500)
            location.href = "/me/profile"
        }catch(e: any){
            console.log(e)
            const _err = e.response?.data?.startsWith("tuned:") ? e.response.data.replace("tuned:", "") : "Something went wrong"
            err = (_err)
            btn.textContent = "Retry"
            btnDisabled = (false)
        }
     }

     const validClass = "text-white fw-6", invalidClass = "text-error-2"

     const submitForm = async (e:any)=>{
        try {
                // btnDisabled = (true);
                const form = e.target
                err = ("");
                console.log("Signing up...");
                jq("#su-btn").text("Signing up...");
                let password = form["password"].value;
                let email = form["email"].value;
                let username = form["username"].value;
                formData = ({...formData, email})
                let fd = { password, email, username };
                localApi.post("/auth/signup?method=custom", fd)
                    .then((res) => {
                        jq(".inProgress").hide();
                        err = ("");
                        jq(".su-btn").text("Successful!");
                        const { id } = res.data;
                        console.log(id);
                        btnDisabled = (false);
                        step = (1)
                    })
                    .catch((er: any) => {
                        handleErrs(er)
                        jq(".inProgress").hide();
                        let error = er.response?.data;
                        jq(".su-btn").text("Retry");

                        // err = error?.startsWith('tu:') ? error.replace('tu:', '') : 'Something went wrong'
                        btnDisabled = (false);
                    });
            } catch (e) {
                handleErrs(e);
                // btnDisabled = (false);
                jq("#su-btn").text("Error! Retry...");
            }
     }
    onMount(()=>{
        const form = formRef?.querySelector('form');
        if (!form) return;
        let pass: HTMLInputElement = form.querySelector("#pass")!;

        const pwdInp = form["password"];
        let letter = document.getElementById("letter")!;
        let capital = document.getElementById("cap")!;
        let number = document.getElementById("num")!;
        let length = document.getElementById("len")!;

        // pwdInp.onfocus = () => {
        //     jq(".pwd-val").show();
        // };
        // pwdInp.onblur = () => {
        //     jq(".pwd-val").hide();
        // };
        const checkPass = () => {
            let lows = /[a-z]/g;
            if (pwdInp.value.match(lows)) {
                jq(letter).removeClass(invalidClass);
                jq(letter).addClass(validClass);
            } else {
                jq(letter).addClass(invalidClass);
                jq(letter).removeClass(validClass);
            }

            let caps = /[A-Z]/g;
            if (pwdInp.value.match(caps)) {
                jq(capital).removeClass(invalidClass);
                jq(capital).addClass(validClass);
            } else {
                jq(capital).addClass(invalidClass);
                jq(capital).removeClass(validClass);
            }

            let nums = /[0-9]/g;
            if (pwdInp.value.match(nums)) {
                jq(number).removeClass(invalidClass);
                jq(number).addClass(validClass);
            } else {
                jq(number).addClass(invalidClass);
                jq(number).removeClass(validClass);
            }

            if (pwdInp.value.length >= 8) {
                jq(length).removeClass(invalidClass);
                jq(length).addClass(validClass);
            } else {
                jq(length).addClass(invalidClass);
                jq(length).removeClass(validClass);
            }

            const pwdVal: string = pwdInp.value;
            const pwdValid =
                pwdVal.match(lows) &&
                pwdVal.match(caps) &&
                pwdVal.match(nums) &&
                pwdVal.length >= 8;
            btnDisabled = (!pwdValid);
            // if (pwdValid) jq(".pwd-val").hide();
        }
        checkPass()
        pwdInp.onkeyup = checkPass;
    })
</script>

<div class="flex items-center justify-center w-100p h-100p">
    <TMeta title={`Signup - ${SITE}`}/>
    {#if step == 0}
    <div bind:this={formRef}><UForm onsubmit={submitForm}  id="su-form" autocomplete="off">
            <fieldset class="formset m-auto border-card border-1 p-4 pb-4">
            <legend class="text-primary"><TuLink to="/">{SITE}</TuLink></legend>
                <h2 class="text-cente my-3 fw-6">Sign up</h2>
                <UFormGroup label="Username">
                     
                        <UInput
                            type="text"
                            name="username"
                            required
                            class=""
                            placeholder="e.g. johndoe"
                        />
                </UFormGroup>
                <UFormGroup label="Email">
                    
                        <UInput
                            type="email"
                            name="email"
                            required
                            placeholder="e.g. johndoe@gmail.com"
                        />
                </UFormGroup>
                <UFormGroup label="Password">
                     <UInput
                                autocomplete="off"
                                type={passType}
                                id="pass"
                                name="password"
                                required
                                class="grow"
                                bind:value={pwd}
                                placeholder="Enter password..."
                                pattern={passPattern.source}
                                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                            >
                            {#snippet trailing()}
                            {#if passType == "password"}
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <span
                                onclick={() => {
                                    passType = ("text");
                                }}
                                class="btn-none"
                                title="show password"
                            >
                                <i class="fi fi-rr-eye"></i>
                            </span>
                        {:else}
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <span
                                class="btn-none"
                                onclick={() => {
                                    passType = ("password");
                                }}
                                title="hide password"
                            >
                                <i class="fi fi-rr-eye-crossed"></i>
                            </span>
                        {/if}
                            {/snippet}
                        </UInput>
                            
                        <div class="pwd-val form-group my-2 ml-2 text-center ">
                            <p class="fs-12">
                                Must contain{" "}
                                <span
                                    id="letter"
                                    class={`fw-5 ${invalidClass}`}
                                >
                                    a lowercase
                                </span>
                                ,{" "}
                                <span
                                    id="cap"
                                    class={`fw-5 ${invalidClass}`}
                                >
                                    an uppercase
                                </span>
                                ,{" "}
                                <span
                                    id="num"
                                    class={`fw-5 ${invalidClass}`}
                                >
                                    a number
                                </span>
                                , and{" "}
                                <span
                                    id="len"
                                    class={`fw-5 ${invalidClass}`}
                                >
                                    at least 8 characters
                                </span>
                            </p>
                       
                </UFormGroup>
                <div class="fs-14 mt-1 ml-1 text-center">
                    <TuLink
                        to="/auth/reset-password"
                        class="text-primary text-center"
                    >
                        Forgot password?
                    </TuLink>
                </div>
                {#if err?.length != 0} <div class="mt-2 ml-2 text-whit fs-12 text-center text-error"><p >{err?.replace("tuned:", "")}</p></div>{/if}
                <div class="mt-2 form-group ">
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
                        <TuLink
                            to="/auth/login"
                            class="text-primary"
                        >
                            Login
                        </TuLink>
                    </p>
                </div>
            </fieldset>
        </UForm></div>
        
        {:else}
        <UForm onsubmit={submitOTP}>
            <fieldset class="formset m-auto border-card border-1 px-5 pb-5">
                <legend class="flex items-center gap-2"> <UButton onclick={()=>step = 0} type="button" class="mt-1"><i class="fi fi-br-arrow-left"></i></UButton> <div>{SITE} auth</div></legend>
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
                        value={formData.otp}
                        onchange={(e: any) => {
                            if (isNaN(e.target.value as any)) return;
                            formData = ({
                                ...formData,
                                otp: e.target.value,
                            });
                        }}
                    />
                </UFormGroup>
                {#if err?.length != 0}  <p class="mt-2 ml-2 text-error fs-12 text-center">{err?.replace("tuned:", "")}</p>{/if}
                <div class="my-2">
                    <UButton type="submit" disabled={formData.otp?.length < 4 || btnDisabled} class="w-100p btn btn-primary">
                        Submit
                    </UButton>
                </div>
            </fieldset>
        </UForm>
        {/if}
</div>