<template>
    <div >
      <div class="form-container p-3">
        <TMeta
          title="Login - TunedStreamz"
          keywords="login tunedstreamz, tunedstreamz login, tunedstreamz auth"
        /> 

  
        <form
          @submit="login"
          autocomplete="off"
          class="auth=f "
          action=""
          method="POST"
        >
        <fieldset class="formset m-auto border-card">
            <legend>Login</legend>
          <input hidden autocomplete="off" />

          <div class="form-group mb-3">
            <label for="email">Email:</label>
            <input
              type="email"
              id="email"
              required
              class="form-control"
              name="email"
              placeholder="Email Address"
              autocomplete="off"
            />
          </div>
          <div class="form-group mb">
            <label for="pass">Password:</label>
  
            <input
              id="pass"
              type="password"
              required
              class="form-control"
              name="password"
              placeholder="Password"
              autocomplete="off"
            />
            <NuxtLink class="mt-4 mb-4 color-orange" to="/contact-us">
              Forgot password?
            </NuxtLink>
            <div class="err">
              <p>{{ err }}</p>
            </div>
          </div>
          <div class="t-c">
            <div class="form-group mt-3 mb-3">
              <button type="submit" id="li-btn" class="btn bg-card2 w-100p">
                {{ txt }}
              </button>
            </div>
            <div class="form-group mb-3 text-center">
              <div>or...</div>
              <NuxtLink class="color-orange" to="/auth/signup"
                >Create account
              </NuxtLink>
            </div>
          </div>  </fieldset>
        </form>
  
      </div>
    </div>
  </template>
  <script setup lang="ts">
import { ref } from "vue";
import { post } from "../../utils/api";
import $ from "jquery";

const txt = ref("Login");
const err = ref("");


const route = useRoute()
const router = useRouter()

function  login(e: any) {
      e.preventDefault();
      const redirect = route.query.red;

      const { email, password } = e.target;
      const fd = new FormData();
      fd.append("email", email.value);
      fd.append("password", password.value);
      $(".inProgress").show();
      txt.value = "Loging in...";
      post("/auth/login", fd)
        .then((res) => {
          $(".inProgress").hide();
          localStorage.setItem("tuned-token", res.data.token);
          //dispatch(setUser(res.data.user))

          ///console.log(res.data.user)
          let rd = "";
          if (redirect) {
            rd = redirect as string;
          }
          txt.value = "Success!";
          window.location.href = window.location.origin + rd;
        })
        .catch((er) => {
          $(".inProgress").hide();
          txt.value = "Retry";
          console.log(er);
          console.log(er.response);
          let error = er.response?.data?.message;
          console.log(error);
          if (error) err.value = error;
        });
    }

    definePageMeta({
  layout: "nohead",
});
</script>
