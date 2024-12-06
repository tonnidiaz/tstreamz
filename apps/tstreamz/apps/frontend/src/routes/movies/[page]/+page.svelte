<script>
    import { page } from "$app/stores";
    import MoviesPage from "@/components/MoviesPage.svelte";
    const {} = $props()

</script>

<MoviesPage num={`${$page.params.page}`}/>