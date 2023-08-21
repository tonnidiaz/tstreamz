<template>
    <div>
        <div style="height: 5px" class="the-top"></div>
        <TMeta
            v-if="tv"
            :url="root + `/watch/tv/${tv?.id}`"
            :keywords="`TunedBass, TunedStreamz, ${tv?.name}, Watch ${tv?.name} TunedStreamz`"
            :src="imgUrl + tv?.poster_path"
            :desc="tv?.overview"
            :title="`Watch ${tv?.name} S${sNum}E${eNum} - TunedStreamz`"
        />
        <ClientOnly v-if="tv">
            <div>
            
                <div style="margin-top: 10px;" class="mb-4 br-10 video-frame d-flex ai-center jc-center sandes ">
                    <iframe
                        width="100%"
                        height="500"
                        scrolling="no"
                        frameborder="0"
                        allowfullscreen
                        class="br-4"
                        id="frame"
                        :src="embedUrls(1)"
                    ></iframe>
                    <!--/*:src="`https://www.2embed.cc/embedtv/${tv.id}&s=${s}&e=${e}`"*/-->
                </div>

                <div class="mt-14 d-flex-md sandes p-3 br-10">
                    <div
                        class="m-auto w-250 pos-rel h-280"
                        style="flex-shrink: 0"
                    >
                        <span
                            style="
                                box-sizing: border-box;
                                display: block;
                                overflow: hidden;
                                width: initial;
                                height: initial;
                                background: none;
                                opacity: 1;
                                border: 0px;
                                margin: 0px;
                                padding: 0px;
                                position: absolute;
                                inset: 0px;
                            "
                        >
                            <img
                                alt="Banner"
                                class="br-4"
                                :src="imgUrl + tv?.poster_path"
                            />
                        </span>
                    </div>
                    <div class="movie-info mt-14">
                        <h1>{{ tv?.name }}</h1>
                        <div class="mt-2">
                            <div class="d-flex ai-center">
                                <div>
                                    <TrailerBtn :id="tv?.id" :isShow="true" />
                                </div>
                                &nbsp; &nbsp;<span class="rating color-yellow"
                                    ><span><i class="fas fa-star"></i> </span>
                                    {{ tv?.vote_average }}</span
                                >&nbsp; &nbsp;
                                <WatchlistBtn :item="tv" :isShow="true" />
                                <!--Watchlist button-->
                            </div>
                            <p class="plot mt-13">
                                {{ tv?.overview }}
                            </p>
                        </div>
                        <div class="meta row">
                            <ul class="col-md-7 col-lg-6">
                                <li>
                                    <p>
                                        <b>Genre(s): </b>
                                        <NuxtLink
                                            :key="i"
                                            v-if="tv?.genres"
                                            v-for="(it, i) in tv?.genres"
                                            :to="`/tv/genre/${it?.id}`"
                                        >
                                            <span
                                                v-if="
                                                    i != tv?.genres.length - 1
                                                "
                                            >
                                                <NuxtLink
                                                    :to="`/tv/genre/${it?.id}`"
                                                    class="link"
                                                >
                                                    {{ it.name }}
                                                </NuxtLink>
                                                &nbsp;|&nbsp;
                                            </span>
                                            <NuxtLink
                                                class="link"
                                                :to="`/tv/genre/${it?.id}`"
                                                v-else
                                            >
                                                {{ it.name }}
                                            </NuxtLink>
                                        </NuxtLink>
                                    </p>
                                </li>

                                <li>
                                    <p>
                                        <b>Date: </b>
                                        {{ tv?.first_air_date.split("-")[0] }} -
                                        {{ tv?.last_air_date.split("-")[0] }}
                                    </p>
                                </li>
                            </ul>
                            <ul class="col-md-7 col-lg-6">
                                <li>
                                    <p><b>Status: </b>{{ tv?.status }}</p>
                                </li>
                                <li>
                                    <p>
                                        <b>Language(s): </b>
                                        <span
                                            :key="i"
                                            v-for="(
                                                it, i
                                            ) in tv?.spoken_languages"
                                        >
                                            <span
                                                v-if="
                                                    i !==
                                                    tv?.spoken_languages
                                                        .length -
                                                        1
                                                "
                                                >{{
                                                    it.name
                                                }}&nbsp;&#x2022;&nbsp;</span
                                            >
                                            <span v-else>{{ it.name }}</span>
                                        </span>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="mt-13 mb-3">
                    <DillaBanner />
                </div>
                <div class="mt-13 sandes  br-10 p-2 row mb-3" style="margin: 0">
                    <div v-if="epsReady">
                        <div v-if="currEp">
                            <h5>
                                S{{ sNum }}Ep{{ eNum }}: &nbsp;{{ currEp.name }}
                            </h5>
                            <div class="mt-2 mb-2">
                                <p>Date: {{ currEp.air_date }}</p>
                            </div>
                            <p>
                                {{ currEp.overview }}
                            </p>
                        </div>

                        <div v-else class="loading-div">
                            <p class="fs-20">No data!</p>
                        </div>
                    </div>
                    <div v-else class="skel w-100p h-150">
                        <h5 class="skel-text">Episode name</h5>
                        <div class="mt-2 mb-2">
                            <p class="skel-text">Date: 0000-00-00</p>
                        </div>
                        <p class="skel-text">
                            Lorem ipsum dolor, sit amet consectetur adipisicing
                            elit.
                        </p>
                        <p class="skel-text">
                            Lorem ipsum dolor, sit amet consectetur adipisicing
                            elit.
                        </p>
                        <p class="skel-text">
                            Lorem ipsum dolor, sit amet consectetur adipisicing
                            elit.
                        </p>
                        <p class="skel-text">
                            Lorem ipsum dolor, sit amet consectetur adipisicing
                            elit.
                        </p>
                    </div>
                </div>
                <div class="mt-13 sandes br-10 row mb-3 pd-5 pdb-10" style="margin: 0">
                    <div class="col-md-4">
                    <fieldset class=" p-4 w-100p fieldset border-card no-el">
                        <legend>Seasons</legend>

                        <div class="mt-2 row">
                            <NuxtLink
                                :key="i"
                                v-for="(season, i) in tv?.seasons"
                                :class="`col m-1 btn btn-sm btn-outline-dark ${
                                    `${sNum}` === `${i + 1}` ? 'active' : ''
                                }`"
                                :to="`/watch/tv/${tv?.id}?s=${i + 1}&ep=1`"
                                >Season {{ i + 1 }}</NuxtLink
                            >
                        </div>
                    </fieldset>
                </div>
                <div class=" col-md-8">
                    <fieldset class=" p-4 fieldset no-el border-card">
                        <legend class="">Episodes</legend>
                        <div class="mt-2 row">
                            <NuxtLink
                                :key="i"
                                v-if="episodes"
                                v-for="(ep, i) in episodes?.episodes"
                                :title="ep.name"
                                :class="`col-md-3 m-1 w-nowrap btn btn-sm btn-outline-dark  ${
                                    eNum === `${ep.episode_number}`
                                        ? 'active'
                                        : ''
                                }`"
                                :to="`/watch/tv/${tv?.id}?s=${ep.season_number}&amp;ep=${ep.episode_number}`"
                            >
                                Episode {{ i + 1 }} : {{ ep.name }}</NuxtLink
                            >

                            <div class="loading-div" v-else>
                                <span>Loading Episodes...</span>
                            </div>
                        </div>
                    </fieldset>
                </div>
                </div>

                <div class="mt-14">
                    <TerraBanner />
                </div>
                <div  class="mt-14">
                    <h3 class="he">Similar Shows</h3>
                    <div style="padding-left: 15px" class="mt-13 os d-flex">
                        <FixedMovieCard
                            :movies="meta.similar"
                            :isShow="true"
                            v-if="meta"
                        />
                        <div v-else class="loading-div">
                            <h5>Loading...</h5>
                        </div>
                    </div>
                </div>
            </div>
        </ClientOnly>

        <div
            v-else
            @touchmove="(e) => e.preventDefault()"
            @wheel="(e) => e.preventDefault()"
            class="d-flex ai-center jc-center loda"
        >
            <p class="fs-40"><b>Loading....</b></p>
        </div>
        <Hold />
    </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, watch, onMounted } from "vue";
import { imgUrl, root } from "../../../../utils/constants";
import TerraBanner from "../../../../components/sda/TerraBanner.vue";
import DillaBanner from "../../../../components/sda/DillaBanner.vue";
import axios from "axios";

const meta = ref<any>(null),
    setMeta = (v: any) => (meta.value = v);
const episodes = ref<any>(null),
    setEpisodes = (v: any) => (episodes.value = v);
const epsReady = ref<any>(null),
    setEpsReady = (v: any) => (epsReady.value = v);
const currEp = ref<any>(null),
    setCurrEp = (v: any) => (currEp.value = v);
const sNum = ref<any>(null),
    setSNum = (v: any) => (sNum.value = v);

const eNum = ref<any>(null),
    setENum = (v: any) => (eNum.value = v);
const tv = ref<any>(null);

const route = useRoute();
const id = ref(route.params.id);

const embedUrls = (i: number = 0) => {
    const movieId = tv.value?.id;
    return false
        ? [
              `https://multiembed.mov/?video_id=${movieId}&tmdb=1`,
              `https://www.2embed.cc/embedtv/${route.params.id}&s=${
                  route.query.s ? route.query.s : "1"
              }&e=${route.query.ep ? route.query.ep : "1"}`,
          ][i]
        : "";
};

const getEps = async (id: any, s: string) => {
    const url = root + `/api/tv/${id}?s=${s}`;

    setEpsReady(false);
    try {
        const { data } = await axios.get(url);
        const episodes = data.data;
        return episodes;
    } catch (e) {
        console.log("ERRA: ", e);
        setEpsReady(true);
        throw e; /* createError({
        statusCode: 500,
        message: "Error fetching episodes"
    }) */
    }
};

const getMeta = async (id: any) => {
    const url = `/api/meta/tv/${id}`;

    const { data } = await axios.get(url);
    const { meta } = data;
    return meta;
};

/// Get the show
const { data, error, execute, refresh } = await useFetch<any>(
    "/api/watch/tv/" + id.value,
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
tv.value = data.value.tv;

const setupEps = async (s: any) => {
    // When season changes
    try {
        const eps = await getEps(id.value, s);
        setEpisodes(eps);
        setCurrEp(eps.episodes[0]);
        setEpsReady(true);
    } catch (e) {
        console.log(e);
    }
};

watch(episodes, (val) => {
    const { ep } = route.query;
    const e = ep ?? "1";
    const i = parseInt(`${e}`) - 1;
    if (val.episodes) setCurrEp(val.episodes[i]);
    setEpsReady(true);
});

const scrollToTheTop = () => {
    const _top = document.querySelector(".the-top");
    _top?.scrollIntoView({ behavior: "smooth" });
};

watch(
    () => route.query,
    (v) => {
        scrollToTheTop();

        let { s, ep } = v;
        s = s ?? "1";
        ep = ep ?? "1";
        setSNum(s);
        setENum(ep);
        if (episodes.value.episodes) {
            setCurrEp(episodes.value.episodes[parseInt(`${ep}`) - 1]);
        } else {
            setCurrEp(null);
        }
    }
);

const setupMeta = async () => { 
    const mta = await getMeta(id.value);
        setMeta(mta);
 }
watch(sNum, (val) => {
    setupEps(val);
});

onBeforeMount(() => {
    // When show changes
    scrollToTheTop();

    setupMeta()
    setSNum(null);
    if (tv.value) {
        let { s, ep } = route.query;
        s = s ?? "1";
        ep = ep ?? "1";
        setSNum(s)
        setENum(ep)
    }
});
</script>
