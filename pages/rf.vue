<template>
    <div class="">
        <h1>Research Facility</h1>
            <Dialog title="Enter your password to proceed" :onCancel="()=> showDialog = false" v-if="showDialog">
                <div class="form-group">
                  <label style="font-weight: 500;" class="fs-16" htmlFor="pass">
                    Password:
                  </label>
                  <input
                    placeholder="Enter password..."
                    class="form-"
                    type="password"
                    id="pass"
                    name="pass"
                    required
                  />
                </div>
  
            </Dialog>
        
        <button @click="_=> showDialog = true">Show  modal</button>
    </div>
</template>

<script setup>
    const showDialog = ref(false)
</script>