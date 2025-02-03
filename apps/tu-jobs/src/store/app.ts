import { SITE } from "@/utils/consts";
import { createTuStore } from "@repo/ui-next/store/utils";

export const appStore = () => createTuStore("app", {
    ready: false,
    counter: 0,
    screenSz: {w: 0, h: 0},
    title: SITE
})