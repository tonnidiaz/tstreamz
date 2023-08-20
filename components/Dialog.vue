<template>
      <div style="margin: 0 auto" class="w-500px p-10 dialog bg-card2">
            
            <h4 class="fs-20">Confirm password</h4>
              <div class="">
                <div class="form-group">
                  <label htmlFor="pass">
                    Password:
                  </label>
                  <input
                    placeholder="Password"
                    class="form-"
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
</template>

<style lang="scss">

$dlg-border-color: #434343;
$dlg-bg-color: #333333;
.dialog{
    border: 2px solid $dlg-border-color;
    padding: 10px;

    input{
        display:  block;
        outline: none;
        border: 2px solid $dlg-border-color !important;
        background-color: $dlg-bg-color !important;
        &:focus, &:active{
            box-shadow: ;
        }
    }
}
</style>