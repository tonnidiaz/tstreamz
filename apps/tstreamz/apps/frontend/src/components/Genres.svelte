    {#if genres}
    <div  class="genres flex flex-col gap-4">
        <section>
          <h3 class="title mb-3">Movies</h3>
          <!-- <UDivider class="mt-2"/> -->
          <ul class="movies list-disc list">
              {#each genres?.movies as it, i}
                  <li>
              <TuLink class="nav-link" to={`/movies/genre/${it.id}`}><span class="fw-7 text-white">
                &#9675;
              </span>{
                it.name
              }</TuLink>
            </li>
              {/each}
            
          </ul> 
        </section>
        <section>
          <h3 class="title mb-3">TV Shows</h3>
          <!-- <UDivider class="mt-2"/> -->
          <ul class="movies list-disc list">
            {#each genres?.shows as it, i}
                 <li >
              <TuLink class="nav-link" to={`/tv/genre/${it.id}`}><span class="fw-7 text-white">
                &#9675;
              </span>{
                it.name
              }</TuLink>
            </li>
            {/each}
           
          </ul>
        </section>
      </div>
    {/if}
   
  
  <script  lang="ts">
    import { appStore as _appStore } from '@/stores/app.svelte';
    import TuLink from '@repo/ui/components/TuLink.svelte';
    import UDivider from '@repo/ui/components/UDivider.svelte';

    let {genres} = $derived(_appStore)
  </script>
  