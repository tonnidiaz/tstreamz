<script lang="ts">
    import "@repo/ui/styles/all.scss";
    import "@flaticon/flaticon-uicons/css/all/all.css";
    let { children } = $props();
</script>
<div class="tu-app">
   {@render children()} 
</div>

