{#if movie.poster_path}
    <div class="my-4 card search-res">
      <div class="flex">
        <div class="cover mr-2 pos-rel">
          <TuLink
            to={isShow ? '/watch/tv/' + movie.id : '/watch/m/' + movie.id}
            class="ttl"
          >
            <img alt="Banner" loading="lazy" src={imgUrl + movie.poster_path} />
          </TuLink>
        </div>
        <div class="w-100p">
         
            <TuLink
            to={isShow ? '/watch/tv/' + movie.id : '/watch/m/' + movie.id}
              class="ttl"
            > <h2 class="fs-16 w-100p text-white">
              { isShow ? movie.name : movie.title }</h2></TuLink
            >
          
  
          <div class="flex ai-center">
            <TuLink to="" class="fs-14">
              { isShow ? movie.first_air_date : movie.release_date }
            </TuLink>
            &nbsp; &bull; &nbsp;
            <TuLink to="" class="fs-14">{ movie.original_language }</TuLink>
          </div>
  
          <div class="ai-center flex justify-between">
            <TrailerBtn id={movie.id} isShow={isShow} class='bg-orange'/>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span class="color-yellow fs-13">
              <i class="fi fi-ss-star"></i>&nbsp;{ movie.vote_average }
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <WatchlistBtn item={movie} isShow={isShow} />
          </div>
        </div>
      </div>
    </div>
  
{/if}    
  <script lang="ts">
    import { imgUrl } from "@/lib/constants";
    import type { IObj } from "@cmn/utils/interfaces";
    import TuLink from "@repo/ui-sv/components/TuLink.svelte";
    import TrailerBtn from "./TrailerBtn.svelte";
    import WatchlistBtn from "./WatchlistBtn.svelte";

  const {movie, isShow} : {movie: IObj; isShow?: boolean} = $props()
  </script>
  