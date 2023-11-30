<template>
    <div>
        <TMeta />
        <div>
            <div>
                <div class="body">
                    <div class="mt-10">
                        <h1 class="t-c fs-24 fw-7">
                            <b>
                                Tuned<span class="color-orange"
                                    >Streamz</span
                                ></b
                            >
                        </h1>
                        <p class="t-c text-white mt-1">
                            Watch all your favorite
                            <span class="color-orange">Movies</span> And
                            <span class="color-orange">TV Shows</span> in
                            <span class="color-orange"> HD</span>!
                        </p>

                        <section>
                            <h2 class="mb-2 he">Top Shows</h2>
                            <div class="">
                                <FixedMovieCard
                                    v-if="homeStore.topShows"
                                    :isShow="true"
                                    name="Prop"
                                    :movies="homeStore.topShows"
                                />
                                <CardPH v-else :movies="[...Array(50)]" />
                            </div>
                        </section>
                        <section>
                            <h2 class="mb-2 he">Top Movies</h2>
                            <div class="">
                                <FixedMovieCard
                                    v-if="homeStore.topMovies"
                                    name="Prop"
                                    :movies="homeStore.topMovies"
                                />
                                <CardPH v-else :movies="[...Array(50)]" />
                            </div>
                        </section>
                        <TerraBanner />
                        <section>
                            <h3 class="mb-2 he">popular Shows</h3>
                            <div class="">
                                <FixedMovieCard
                                    v-if="homeStore.popularShows"
                                    :isShow="true"
                                    name="Prop"
                                    :movies="homeStore.popularShows"
                                />
                                <CardPH v-else :movies="[...Array(50)]" />
                            </div>
                        </section>
                        <section>
                            <h2 class="mb-2 he">popular Movies</h2>
                            <div class="">
                                <FixedMovieCard
                                    v-if="homeStore.popularMovies"
                                    name="Prop"
                                    :movies="homeStore.popularMovies"
                                />
                                <CardPH v-else :movies="[...Array(50)]" />
                            </div>
                        </section>
                        <TerraBanner />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from "axios";
import FixedMovieCard from "../components/FixedMovieCard.vue";
import CardPH from "../components/CardPH.vue";
import TerraBanner from "../components/sda/TerraBanner.vue";
import { rand } from "../utils/functions";
import { ref } from "vue";
import DillaBanner from "../components/sda/DillaBanner.vue";
import { useHomeStore } from "@/stores/home";
const homeStore = useHomeStore();

const terra160x300 = ref();

async function getPopularShows() {
    try{
    const url = "/api/shows?t=popular&page=" + rand(1, 100);
    const { data } = await axios.get(url);
    homeStore.setPopularShows(data.data);
    }
    catch(e){
        console.log(e)
    }
}
async function getTopShows() {
    try{
    const url = "/api/shows?t=top&page=" + rand(1, 100);
    const { data } = await axios.get(url);
    homeStore.setTopShows(data.data);
    }
    catch(e){
        console.log(e)
    }
}
async function getPopularMovies() {
    try{
    const url = "/api/movies?t=popular&page=" + rand(1, 100);
    const { data } = await axios.get(url);
    homeStore.setPopularMovies(data.data);
    }
    catch(e){
        console.log(e)
    }
}
async function getTopMovies() {
    try{
    const url = "/api/movies?t=top&page=" + rand(1, 100);
    const { data } = await axios.get(url);
    homeStore.setTopMovies(data.data);
    }
    catch(e){
        console.log(e)
    }
}

const getContent = async () => {
    await getTopShows();
    await getTopMovies();
    await getPopularShows();
    await getPopularMovies();
};
onBeforeMount(() => {
    getContent();
});
</script>

<style>
.he {
    font-size: 24px !important;
    font-weight: 600;
}
</style>
