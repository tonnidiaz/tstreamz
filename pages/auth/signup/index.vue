<template>
    <div>
      <div class="p-3 form-container body">
        <Head>
          <TMeta
            title="Create account - TunedStreamz"
            keywords="login tunedstreamz, tunedstreamz login, tunedstreamz auth"
          />
  
          <Meta
            name="keywords"
            content="login tunedstreamz, tunedstreamz login, tunedstreamz auth"
          />
        </Head>
        <div class="m" v-if="isSuccessful">
            <fieldset class="formset m-auto border-card">
            <legend>Signup successful!</legend>

            <h3 class="fs-18 color-white-2 text-center">Please use the verification link we've sent to your email to complete signing up.</h3>
            </fieldset>
        </div> 
        <form v-else
          ref="formRef"
          id="su-form"
          
          autocomplete="off"
        >
        <fieldset class="formset m-auto border-card">
            <legend>Create account</legend>
         
          <div class="form-group mb-13">
            <label for="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              class="form-control"
              placeholder="Enter your username..."
              min-length="3"
              autocomplete="off"
              autocorrect="off"
            />
          </div>
          <div class="form-group mb-13">
            <label for="email">Email:</label>
            <input
            id="email"
              type="email"
              name="email"
              required
              class="form-control"
              placeholder="Enter your email address..."
            />
          </div>
          <div class="form-group mb-13">
            <label for="pass">Password:</label>
            <input
              auto-complete="off"
              :type="passType"
              id="pass"
              name="password"
              required
              class="form-control"
              placeholder="Enter password..."
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
            />
            <div style="left: -8px" class="Addon">
              <span
                v-if="passType == 'password'"
                @click="setPassType('text')"
                class="btn-none"
                title="show password"
              >
                <i class="fad fa-eye-slash"></i>
              </span>
  
              <span
                v-else
                class="btn-none"
                @click="setPassType('password')"
                title="hide password"
              >
                <i class="fad fa-eye"></i>
              </span>
            </div>
          </div>
  
          <div class="pwd-val form-group mb-13 p-10 d-none">
            <p class="fs-15 fw-5 color-white-1">
              Password must contain the following:
            </p>
            <ul>
              <li style="list-style-type: disc">
                <p id="letter" class="text-danger">
                  A <span class="fw-6">lowercase </span>letter
                </p>
              </li>
              <li style="list-style-type: disc">
                <p id="cap" class="text-danger">
                  A <span class="fw-6">capital </span>letter
                </p>
              </li>
              <li style="list-style-type: disc">
                <p id="num" class="text-danger">
                  A <span class="fw-6">number </span>letter
                </p>
              </li>
              <li style="list-style-type: disc">
                <p id="len" class="text-danger">
                  A minimum of <span class="fw-6">8 characters </span>
                </p>
              </li>
            </ul>
          </div>
          <div class="form-group mb-13">
            <label for="conf-pass">Confirm password</label>
            <input
  
              autocomplete="off"
              type="password"
              id="conf-pass"
              name="conf-pass"
              required
              class="form-control"
              value=""
              placeholder="Confirm your password..."
            />
            <div class="mt-3 t-c error">
              <p class="fs-12 color-red">{{ err }}</p>
            </div>
          </div>
          <div class="form-group d-none form-check">
            <input
              class="form-check-input"
              type="checkbox"
              aria-checked="false"
              name="terms"
              id="terms"
            />
            <label for="terms">
              I have read and agreed to the
              <NuxtLink class="tb-link" to="/terms-of-service">
                Terms of service
              </NuxtLink>
              &
              <NuxtLink class="tb-link" to="/privacy-policy">
                Privacy policy
              </NuxtLink>
              .
            </label>
          </div>
          <div class="mt-4 form-group t-c mb-13">
            <button
              type="submit"
              :disabled="btnDisabled"
              id="su-btn"
              class="btn su-btn bg-dark-0 border-body w-100p"
            >
              Sign up
            </button>
          </div>
          <div class="form-group mb-13 text-center">
            <p>
              Already have an account?
              <NuxtLink to="/auth/login">
                <a class="color-orange">Login</a>
              </NuxtLink>
            </p>
          </div>
          </fieldset>
        </form>
      </div>
    </div>
  </template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import $ from 'jquery'
import { post } from "../../../utils/api";

const isSuccessful = ref(false);
const formRef = ref<HTMLFormElement | null>(null)
    const passType = ref("password");
   function setPassType(val : string) {
      passType.value = val;
    }

    const btnDisabled = ref(true), setBtnDisabled = (v: boolean) => {btnDisabled.value = v}
const err = ref("");
function setErr(v: any){
      err.value = v
    }

    const router = useRouter();

onMounted(()=>{
    
    const form = formRef.value
    if (!form) return;
    let pass : HTMLInputElement = form.querySelector("#pass")!;
      let confPass = form.querySelector("#conf-pass")!;
      //let form = document.querySelector("#su-form");

      confPass.addEventListener("keyup", (e: any) => {
        if (e.target.value !== pass.value) {
          //console.log('Passwords do not match...');
         setBtnDisabled(true)
          $(".error p").text("Passwords do not match").css("color", "red");
        } else {
          setBtnDisabled(false)
          $(".error p").text("");
        }
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        
        try{
            setBtnDisabled(true)
            err.value = "";
            console.log("Signing up...")
        $("#su-btn").text("Signing up...");
        let password = form["password"].value;
        
        let username = form["username"].value;
        let email = form["email"].value;

        let fd = new FormData();
        fd.append("username", username);
        fd.append("password", password);
        fd.append("email", email);
        post("/auth/signup?method=custom", fd)
          .then((res) => {
            $(".inProgress").hide();
            err.value = "";
            $(".su-btn").text("Successful!");
            const { id } = res.data;
            console.log(id)
            setBtnDisabled(false)
           isSuccessful.value = true
          })
          .catch((er: any) => {
            $(".inProgress").hide();
            let error = er.response?.data?.message;
            console.log(er);
            console.log(er.response);
            $(".su-btn").text("Retry");

            if (error) {
              if (error === "Could not send email") {
                $(".error p").css("color", "red");
                err.value = "Something went wrong! Please try again later.";
                $(".su-btn").text("Retry");
              } else {
                $(".error p").css("color", "red");
                $(".error p").text(error);
                
                setErr(error);
                $(".err").show();
              }
            }
            setBtnDisabled(false)
          });}
          catch(e){
            console.log(e)
            setBtnDisabled(false)
            $("#su-btn").text("Error! Retry...");
          }
      });
      const pwdInp = form["password"];
        let letter = document.getElementById("letter")!;
        let capital = document.getElementById("cap")!;
        let number = document.getElementById("num")!;
        let length = document.getElementById("len")!;

        pwdInp.onfocus = () => {
          $(".pwd-val").removeClass("d-none");
        };
        pwdInp.onblur = () => {
          $(".pwd-val").addClass("d-none");
        };

        pwdInp.onkeyup = () => {
          let lows = /[a-z]/g;
          if (pwdInp.value.match(lows)) {
            $(letter).removeClass("text-danger");
            $(letter).addClass("text-success");
          } else {
            $(letter).addClass("text-danger");
            $(letter).removeClass("text-success");
          }

          let caps = /[A-Z]/g;
          if (pwdInp.value.match(caps)) {
            $(capital).removeClass("text-danger");
            $(capital).addClass("text-success");
          } else {
            $(capital).addClass("text-danger");
            $(capital).removeClass("text-success");
          }

          let nums = /[0-9]/g;
          if (pwdInp.value.match(nums)) {
            $(number).removeClass("text-danger");
            $(number).addClass("text-success");
          } else {
            $(number).addClass("text-danger");
            $(number).removeClass("text-success");
          }

          if (pwdInp.value.length >= 8) {
            $(length).removeClass("text-danger");
            $(length).addClass("text-success");
          } else {
            $(length).addClass("text-danger");
            $(length).removeClass("text-success");
          }

          if (pwdInp.value !== form["conf-pass"].value) {
            $("#su-btn").attr("disabled", 'true');
            $(".error p").text("Passwords do not match").css("color", "red");
          } else {
            setBtnDisabled(false)
            $(".error p").text("");
          }
        };
})
definePageMeta({
  layout: "nohead",
});
</script>  