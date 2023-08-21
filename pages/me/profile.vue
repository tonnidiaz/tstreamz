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
            <label for="email">Email:</label>
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
            @click="_=>onBtnClick(deleteAccount)"
            type="button"
            class="mb-2 col-md offset-md-2 btn btn-dark"
          >
            Delete account
          </button>
        </div>
</fieldset>
        </form>
        
      </div>
  
      <div v-else class="centered-children loading-div">
        <h5>Please wait...</h5>
      </div>
      <Dialog :onOk="onOk" title="Enter your password to proceed" :onCancel="()=> showDialog = false" v-if="showDialog">
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

            <Toast :txt="toastTxt" v-if="showToast"/>
    </div>
  </template>

  <script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useAppStore } from "../../stores/app";
import { post } from "@/utils/api";
import { storeToRefs } from "pinia";
import $ from 'jquery'
const err = ref("");
const pswd = ref("");
const toastTxt = ref(""), setToastTxt = (v: string) => toastTxt.value = v;
const showDialog = ref(false);
const showToast = ref(false);
const setErr = (v: string) => (err.value = v);

const { user, ready } = storeToRefs(useAppStore())
const { setUser } = useAppStore()
const onOk = ref<Function>(), setOnOk = (val : Function) => onOk.value = val;

const onBtnClick = (onOk : Function) => { 
    setOnOk(onOk);
    showDialog.value = true
 }
function handleChange(e: any) {
      setTimeout(() => {
        setErr("");
      }, 1000);
    }

   function deleteAccount() {
    if(!pswd.value) return;
        console.log("Deleting...");
        setToastTxt("Deleting account...")
        showToast.value = true
        const fd = new FormData()
        fd.append("password", pswd.value)
          //document.body.appendChild(inProgress);
          post(`/user/${user.value._id.$oid}/terminate`, fd)
            .then((res : any) => {
              localStorage.clear();
              setToastTxt("Account deleted successfully!")
              $(".SUCCESS .msg").text("Account deleted successfully!");
              $(".SUCCESS").show();

              setTimeout(() => {
                $(".SUCCESS").hide();
                window.location.href = window.location.origin + "/";
              }, 2000);
            })
            .catch((err: any) => {
                const msg = err.response?.data?.msg
                let errTxt = msg ?? "SOmething went wrong"
                setToastTxt(errTxt)
              $(".ERR .msg").text("Something went wrong!");
              $(".ERR").hide();
              console.log(err.response);
            }).finally(()=>{
                setTimeout(()=>{
                    showToast.value = false
                }, 2500)
                
            });

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