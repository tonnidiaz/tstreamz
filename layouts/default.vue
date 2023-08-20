<template>
    <div>
       
        <div>
            <SearchBar />
            <!--------------------------------------------- UTILS   ---------------------------------------------------------->

            <div id="global-overlay" class=" sch blur"></div>
            <div class="ERR">
                <span>
                    <i class="fad fa-exclamation-triangle"></i>
                </span>
                &nbsp;<span class="msg"></span>
            </div>

            <div class="sch blur"></div>
            <div class="progress inProgress d-none"></div>
            <div ref="tRef" class="trailer-container">
                <div
                    class="trailer bg-blue-2 p-1 d-flex jc-center ai-center pos-rel"
                >
                    <button @click="hideTrailer" class="btn btn-none fs-24">
                        <i class="far fa-times-circle"></i>
                    </button>
                    <iframe
                        title="Trailer frame"
                        v-if="appStore.trailerId"
                        width="100%"
                        height="100%"
                        allowFullScreen
                        frameborder="0"
                        :src="
                            'https://www.youtube.com/embed/' +
                            appStore.trailerId
                        "
                    ></iframe>
                    <div
                        v-else-if="!appStore.trailerId && !appStore.trailerErr"
                        class="loading-div"
                    >
                        <p class="text-white fs-20">Loading...</p>
                    </div>
                    <div v-else class="loading-div">
                        <div class="t-c">
                            <p style="margin-bottom: 0">404</p>
                            <p class="text-white fs-20">
                                Could not get trailer
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <!--------------------------------------------- END UTILS   ---------------------------------------------------------->
            <div id="main-app">
                <Header />
                <div class="dflex _row _main">
                    <Sidenav />
                    <main>
                        <div class="body">
                            <div v-if="hasAdblocker" class="adblocked">
                                <div class="bg-blue-2 p-4">
                                    <div class="t-c">
                                        <h5 class="mb-2 text-danger">
                                            <span
                                                ><i
                                                    class="fas fa-exclamation-triangle"
                                                ></i
                                            ></span>
                                            AdBlocker detected!
                                        </h5>
                                        <p>
                                            Some important functionalities
                                            cannot work with adblock ON.
                                        </p>
                                        <h6>
                                            Please disable your AdBlock to
                                            continue
                                        </h6>
                                        <button
                                            @click="reload"
                                            class="mt-3 btn btn-sm btn-danger"
                                        >
                                            I have disabled my adBlocker
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="app">
                                <slot />
                            </div>
                        </div>

                        <Footer />
                    </main>
                </div>
            </div>

            <div id="social_bar"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref } from "vue";
import Header from "@/components/Header.vue";
import Sidenav from "@/components/Sidenav.vue";
import { get, post } from "@/utils/api";
import { useAppStore } from "@/stores/app";
const hasAdblocker = ref(false);

import $ from "jquery";

const appStore = useAppStore();

const route = useRoute();

function reload() {
    window.location.href = window.location.href;
}

function hideTrailer(e: any) {
    $(e.currentTarget.parentElement.parentElement).removeClass("active");
    appStore.setTrailerId(null);
}
async function getWatchlist() {
    get("/user/watchlist")
        .then((r) => {
            const { watchlist } = r.data;
            appStore.setWatchlist(JSON.parse(watchlist));
        })
        .catch((err) => {
            console.log(err);
        });
}

function getUser() {
    const token = localStorage.getItem("tuned-token");
    if (token) {
        post("/auth/getuser")
            .then(async (res) => {
                const usr = JSON.parse(res.data.user);
                appStore.setUser(usr);

                getWatchlist().then((_) => {
                    console.log("Setting ready!");
                    appStore.setReady(true);
                });
            })
            .catch((err) => {
                appStore.setReady(true);
            });
    } else {
        appStore.setReady(true);
    }
}
onBeforeMount(async () => {
    try {
        getUser();
        const { data } = await axios.get("/api/genres");
        appStore.setGenres(data.genres);
        
    } catch (e) {
        console.log(e);
    }
});

watch(route, (val) => {
    console.log(val);
    window.scrollTo(0, 0);
});
</script>

<style>
.nav-link.nuxt-link-exact-active.nuxt-link-active {
    color: #ff6a06 !important;
}
.adblocked {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999999999;
    background-color: rgba(0, 0, 0, 0.8);
    overflow: hidden;
}

.loda {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999999999;
}

.fw-6 {
    font-weight: 600 !important;
}
.fw-7 {
    font-weight: 700 !important;
}
</style>
