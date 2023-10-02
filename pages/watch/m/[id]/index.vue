<template>
    <div>
        <div style="height: 5px" class="the-top"></div>
        <div class="mt-13">
            <TMeta
                v-if="movie"
                :url="root + `/watch/m/${movie?.id}`"
                :keywords="`TunedBass, TunedStreamz, ${movie?.title}, Watch ${movie?.title} TunedStreamz`"
                :src="imgUrl + movie?.poster_path"
                :desc="movie?.overview"
                :title="`Watch ${movie?.title} - TunedStreamz`"
            />
            <div>
                <div v-if="movie">
                    <div class="title-cont d-none">
                        <h1 class="fs-16 t-c fw-7">
                            You're watching
                            <span class="color-orange">{{ movie.title }}</span>
                        </h1>
                    </div>
                    <select :value="server" @change="(e: any)=>{
                        setServer(e.target.value)
                    }" name="server" id="server" class="form-control w-150 my-5">
                        <option v-for="(server, i) in servers()" :value="i">
                            Server {{ i + 1 }}
                        </option>
                    </select>
                    <div
                        class="mb-4 video-frame d-flex ai-center jc-center sandes br-10"
                    >
                        <iframe
                            title="Tunedtreamz frame"
                            ref="{frame}"
                            width="100%"
                            height="{500}"
                            allowFullScreen
                            webkitallowfullscreen
                            mozallowfullscreen
                            frameborder="0"
                            :src="embedUrls(server)"
                        ></iframe>
                    </div>

                    <div class="mt-14 d-flex-md sandes br-10 p-3">
                        <div
                            style="flex-shrink: 0"
                            class="m-auto w-225 h-280 pos-rel"
                        >
                            <img
                                alt="Movie  banner"
                                loading="lazy"
                                class="br-4"
                                width="100%"
                                height="auto"
                                :src="imgUrl + movie?.poster_path"
                            />
                        </div>

                        <div class="movie-info mt-4">
                            <h1 class="title">{{ movie?.title }}</h1>
                            <div class="mt-2">
                                <div class="d-flex ai-center">
                                    <TrailerBtn :id="movie?.id" />
                                    &nbsp; &nbsp;
                                    <span class="rating color-yellow">
                                        <span>
                                            <i class="fas fa-star"></i>
                                        </span>
                                        {{ movie?.vote_average }}
                                    </span>
                                    &nbsp; &nbsp;
                                    <WatchlistBtn :item="movie" />
                                </div>
                                <p class="plot mt-3">{{ movie?.overview }}</p>
                            </div>

                            <div
                                v-if="meta"
                                style="textoverflow: ellipsis; overflow: hidden"
                                class="meta row"
                            >
                                <ul class="col-md-7 col-lg-6">
                                    <li>
                                        <p>
                                            <b>Cast: </b>
                                            <span
                                                v-if="meta?.credits?.cast"
                                                v-for="(
                                                    it, i
                                                ) in meta.credits.cast.slice(
                                                    0,
                                                    5
                                                )"
                                            >
                                                <span
                                                    v-if="
                                                        i !==
                                                        meta.credits.cast.slice(
                                                            0,
                                                            5
                                                        ).length -
                                                            1
                                                    "
                                                    ><NuxtLink
                                                        class="link"
                                                        :to="`/discover/star/${it.id}`"
                                                    >
                                                        {{ it.name }}
                                                    </NuxtLink>
                                                    &nbsp; | &nbsp;</span
                                                >

                                                <NuxtLink
                                                    v-else
                                                    class="link"
                                                    :to="`/discover/star/${it.id}`"
                                                >
                                                    {{ it.name }}
                                                </NuxtLink>
                                            </span>
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            <b>Genre(s): </b>
                                            <span
                                                v-if="movie?.genres"
                                                v-for="(it, i) in movie?.genres"
                                            >
                                                <span
                                                    v-if="
                                                        i !==
                                                        movie?.genres.length - 1
                                                    "
                                                    ><NuxtLink
                                                        class="link"
                                                        :to="`/movies/genre/${it.id}`"
                                                    >
                                                        {{ it.name }}
                                                    </NuxtLink>
                                                    &nbsp; | &nbsp;</span
                                                >

                                                <NuxtLink
                                                    v-else
                                                    class="link"
                                                    :to="`/movies/genre/${it.id}`"
                                                >
                                                    {{ it.name }}
                                                </NuxtLink>
                                            </span>
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            <b>Language: </b>
                                            {{ movie?.original_language }}
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            <b>Released: </b>
                                            {{ movie?.release_date }}
                                        </p>
                                    </li>
                                </ul>
                                <ul class="col-md-7 col-lg-6">
                                    <li>
                                        <p>
                                            <b>Duration: </b>
                                            {{ movie?.runtime }}m
                                        </p>
                                    </li>
                                    <li></li>
                                    <li>
                                        <p>
                                            <b>Status: </b>
                                            {{ movie?.status }}
                                        </p>
                                    </li>
                                </ul>
                            </div>

                            <div v-else class="mt-4w-100p h-200">
                                <div class="w-100p h-100p">
                                    <h3 class="t-c">Loading...</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4">
                        <!--AD-->
                        <TerraBanner />
                    </div>
                    <section class="mt-10">
                        <h3 class="he">Similar Movies</h3>
                        <div class="mt-3 d-flex os">
                            <FixedMovieCard
                                v-if="meta"
                                :movies="meta.similar ? meta.similar : []"
                            />

                            <div v-else class="loading-div">
                                <h3>Loading...</h3>
                            </div>
                        </div>
                    </section>
                    <DillaBanner />
                </div>

                <div
                    @touchmove="preventScroll"
                    @wheel="preventScroll"
                    v-else
                    class="d-flex ai-center jc-center loda"
                >
                    <p class="fs-40"><b>Loading....</b></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import { imgUrl, root } from "../../../../utils/constants";
import TerraBanner from "../../../../components/sda/TerraBanner.vue";
import DillaBanner from "../../../../components/sda/DillaBanner.vue";
import axios from "axios";

const meta = ref<any>(null),
    setMeta = (v: any) => (meta.value = v);
const server = ref(0), setServer = (v: number)=> server.value = v;
const movie = ref<any>(null);

const route = useRoute();
const id = ref(route.params.id);

const servers = () => [
    `https://multiembed.mov/?video_id=${id.value}&tmdb=1`,
    `https://www.2embed.cc/embed/${id.value}`,
];
const embedUrls = (i: number = 0) => {
    const movieId = movie.value?.id;
    return true ? servers()[i] : "";
};

const getMeta = async (id: any) => {
    console.log("Getting meta...");
    try {
        const url = `/api/meta/m/${id}`;

        const { data } = await axios.get(url);
        const { meta } = data;
        setMeta(meta);
    } catch (e) {
        console.log(e);
        setMeta({});
    }
};

const { data, error, execute, refresh } = await useFetch<any>(
    "/api/watch/m/" + id.value,
    {
        watch: [id],
    }
);

if (error.value) {
    throw createError({
        statusCode: error.value?.statusCode,
        statusMessage: error.value.statusMessage,
    });
}
movie.value = data.value.movie;

const scrollToTheTop = () => {
    const _top = document.querySelector(".the-top");
    _top?.scrollIntoView({ behavior: "smooth" });
};
onBeforeMount(() => {
    scrollToTheTop();
    getMeta(id.value);
});

function preventScroll(e: any) {
    e.preventDefault();
}

//api.123movies.cc
</script>
