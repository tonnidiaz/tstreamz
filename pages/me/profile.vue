<template>
    <div class="body">
      <TMeta title="My Profile - TunedStreamz" />
  
      <div v-if="ready && user?.username" class="mt-40 p-2 br-3 w-600px">
     
        <form id="profile-form" @submit="saveChanges">
            <fieldset class="formset m-auto">
                <legend>My profile</legend>
          <div>
            <p class="err">{{ err }}</p>
          </div>
          <div class="form-group">
            <label for="fname">First Name:</label>
            <br />
            <input
              class="form-control"
              @change="handleChange"
              id="fname"
              name="first_name"
              placeholder="e.g. John"
              :value="user.first_name"
            />
          </div>
          <div class="form-group">
            <label for="lname">Last Name:</label>
            <br />
            <input
              class="form-control"
              @change="handleChange"
              id="lname"
              name="last_name"
              :value="user.last_name"
              placeholder="e.g. Doe"
            />
          </div>
          <div class="form-group">
            <label for="uname">Username:</label>
            <br />
            <input
              class="form-control"
              @change="handleChange"
              id="uname"
              name="username"
              placeholder="e.g. johndoe4587"
              :value="user.username"
              required
            />
          </div>
          <div class="form-group">
            <label for="email">Username:</label>
            <br />
            <input
              class="form-control"
              @change="handleChange"
              id="email"
              name="email"
              placeholder="e.g user@domain.com"
              :value="user.email"
              required
            />
          </div>
          <div class="form-group">
            <label for="iid">Account ID:</label>
            <br />
  
            <input
              v-if="user.is_pro"
              class="form-control"
              @change="handleChange"
              id="iid"
              name="iid"
              :value="user.iid"
            />
  
            <input
              v-else
              title="Only premium users can modify account ID"
              class="disabled-inp form-control"
              disabled
              @change="handleChange"
              id="iid"
              name="iid"
              :value="user.iid"
            />
          </div>
          <div class="row jc-center my-14">
          <button
            id="save-changes-btn"
            type="submit"
            form="profile-form"
            class="mb-2 col-md btn btn-primary"
          >
            Save changes
          </button>
          <button
            @click="e=> deleteAccount(e.currentTarget as HTMLButtonElement)"
            type="button"
            class="mb-2 col-md offset-md-2 btn btn-danger"
          >
            DELETE ACCOUNT
          </button>
        </div>
</fieldset>
        </form>
        
      </div>
  
      <div v-else class="centered-children loading-div">
        <h5>Please wait...</h5>
      </div>
      <Teleport v-if="open" to="#global-overlay">
        <div v-if="open" class="overlayChild">
          <div style="margin: 0 auto" class="w-500px p-10 menu-modal active ">
            
            <h4 class="fs-20">Confirm password</h4>
              <div class="">
                <div class="form-group">
                  <label htmlFor="pass">
                    Password:
                  </label>
                  <input
                    placeholder="Password"
                    class="form-control"
                    type="password"
                    id="pass"
                    name="pass"
                    required
                  />
                </div>
  
                <div class="form-group mt-3">
                  <button class="fw-5 ui red button">Confirm</button>
                </div>
  
                <div class="mt-2 form-group err"></div>
              </div>
          </div>
        </div>
      </Teleport>
    </div>
  </template>
  <script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useAppStore } from "../../stores/app";
import { post } from "@/utils/api";
import { storeToRefs } from "pinia";
import $ from 'jquery'
const err = ref("");
const open = ref(false);
const setErr = (v: string) => (err.value = v);

const { user, ready } = storeToRefs(useAppStore())
const { setUser } = useAppStore()

function handleChange(e: any) {
      setTimeout(() => {
        setErr("");
      }, 1000);
    }

   function deleteAccount(deleteBtn: HTMLButtonElement) {
      setTimeout(() => {
        const conf = window.confirm(
          `Action cannot be undone. Are you sure you want to PERMANENTLY TERMINATE your account?`
        );
        prompt("Enter pass")
return;
        if (conf) {
          deleteBtn.innerText = "Deleting..."
          //document.body.appendChild(inProgress);
          post(`/user/${user.value.iid}/terminate`)
            .then((res : any) => {
              deleteBtn.innerText = "Success!"
              localStorage.clear();
              $(".SUCCESS .msg").text("Account deleted successfully!");
              $(".SUCCESS").show();

              setTimeout(() => {
                $(".SUCCESS").hide();
                window.location.href = window.location.origin + "/";
              }, 2000);
            })
            .catch((err: any) => {
              deleteBtn.innerText = "Retry"
              $(".ERR .msg").text("Something went wrong!");
              $(".ERR").hide();
              console.log(err.response);
            });
        }
      }, 500);
    }
    function saveChanges(e: any) {
      e.preventDefault();
      const btn = $("#save-changes-btn")[0];
      const {
        first_name,
        last_name,
        username
      } = e.currentTarget;

      const fd = new FormData();
      fd.append("first_name", first_name.value);
      fd.append("last_name", last_name.value);
      fd.append("username", username.value);


      btn.innerText = "Saving changes...";
      const inProgress = document.createElement("div");
      inProgress.classList.add("progress");
      document.body.appendChild(inProgress);
      post(`/user/${user.value.iid}/update?f=info`, fd)
        .then((res) => {
          setUser(JSON.parse(res.data.user))
          btn.innerText = "Changes saved!";
          setTimeout(() => {
            btn.innerText = "Save changes";
          }, 1000);
        })
        .catch((err: any) => {
          inProgress.remove();

          $(".ERR .msg").text("Something went wrong!");
          $(".ERR").show();
          btn.innerText = "Could not update profile!";
          setTimeout(() => {
            btn.innerText = "Retry";
          }, 1000);
          setTimeout(() => {
            $(".ERR").hide();
          }, 2500);
          const error = err.response.data.message;
          if (error) console.log(error);
          setErr(error);
        });
    }

    watch(()=> ready.value, val=>{
        if (val && ! user.value) window.location.href = "/auth/login?red=/me/profile"
    }, {deep: true, immediate: true})
</script>