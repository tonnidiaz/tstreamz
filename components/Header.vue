<template>
    <div>
        <header>
            <nav class="navbar navbar-expand-lg navbar-dark">
                <div class="d-flex">
                    <button
                        class="navbar-toggler" 
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        @click="openSideMenu"
                    >
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
                <a class="navbar-brand" href="/"
                    >T <span><i class="fas fa-video"></i></span> S</a
                >
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <NuxtLink class="nav-link" to="/movies"
                                >Movies</NuxtLink
                            >
                        </li>
                        <li class="nav-item">
                            <NuxtLink class="nav-link" to="/tv"
                                >TV Shows</NuxtLink
                            >
                        </li>
                        <li
                            class="nav-item"
                            @mouseleave="hideGenres"
                            @mousedown="showGenres"
                        >
                            <div class="pos-rel">
                                <span to="" class="nav-link pointer"
                                    >Genre</span
                                >
                                <Genres />
                            </div>
                        </li>
                        <li class="nav-item">
                            <NuxtLink class="nav-link" to="/search"
                                >Search</NuxtLink
                            >
                        </li>
                        <li class="nav-item">
                            <NuxtLink class="nav-link" to="/contact-us"
                                >Report issues</NuxtLink
                            >
                        </li>
                    </ul>
                </div>
                <div class="navbar-nav">
                    <div
                        class="nav-item"
                        style="margin-left: 0px; margin-right: 0px"
                    >
                        <div v-if="ready">
                            <div v-if="user?.username" class="">
                                <button
                                    :title="user?.username"
                                    @click="showUserMenu"
                                    class="btn-none fs-24"
                                >
                                    <i class="far fa-user-circle"></i>
                                </button>
                                <div id="user-menu" class="menu-modal">
                                    <ul class="fs-15 t-l">
                                        <li class="nav-item">
                                            <NuxtLink
                                                to="/me/profile"
                                                class="nav-link"
                                            >
                                                <a>
                                                    <span>
                                                        <i
                                                            class="fal fa-user-circle"
                                                        ></i>
                                                    </span>
                                                    Profile
                                                </a>
                                            </NuxtLink>
                                        </li>
                                        <li class="nav-item">
                                            <NuxtLink
                                                to="/me/watchlist"
                                                class="nav-link"
                                            >
                                                <a>
                                                    <span>
                                                        <i
                                                            class="fal fa-bookmark"
                                                        ></i>
                                                    </span>
                                                    Watchlist
                                                </a>
                                            </NuxtLink>
                                        </li>

                                        <hr />
                                        <li class="nav-item">
                                            <NuxtLink
                                                :to="
                                                    '/auth/logout?red=' +
                                                    $route.fullPath
                                                "
                                                class="nav-link"
                                            >
                                                <a>
                                                    <span>
                                                        <i
                                                            class="fal fa-sign-out"
                                                        ></i>
                                                    </span>
                                                    Signout
                                                </a>
                                            </NuxtLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <NuxtLink
                                v-else
                                :to="'/auth/login?red=' + $route.fullPath"
                                class="nav-link btn btn-outline-primary br-30 auth-btn"
                            >
                                <i class="far fa-sign-in"></i>
                            </NuxtLink>
                        </div>
                        <div v-else><b class="fs-24">...</b></div>
                    </div>
                </div>
            </nav>
        </header>
        <SideMenu />
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import SideMenu from "./SideMenu.vue";
import $ from "jquery";
import {storeToRefs} from "pinia"
const appStore = useAppStore();
const { ready, user} = storeToRefs(appStore);

function showGenres() {
    $(".genres").addClass("active");
}
function hideGenres() {
    $(".genres").removeClass("active");
}
function showUserMenu() {
    const menu = $("#user-menu")[0];
    $(menu).addClass("active");
    const hideMenu = (e: any) => {
        if (!menu.contains(e.target)) {
            $(menu).removeClass("active");
            document.removeEventListener("mousedown", hideMenu);
        }
    };
    document.addEventListener("mousedown", hideMenu);
}
function openSideMenu() {
    const menu = $(".sidemenu"),
        blur = $(".blur");
    if (menu.hasClass("open")) {
        menu.removeClass("open");
        blur.removeClass("active");
    } else {
        menu.addClass("open");
        blur.addClass("active");
    }
    const closeMenu = (e: any) => {
        if (!menu[0].contains(e.target)) {
            menu.removeClass("open");
            $(".blur").removeClass("active");
            document.body.removeEventListener("click", closeMenu);
        }
    };
    blur[0]?.addEventListener("click", closeMenu);
}
</script>
