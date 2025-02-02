import { createTuStore } from "@repo/ui-next/store/utils";

export const appStore = () => createTuStore("app", {
    ready: false,
    counter: 0,
    title: "Tu app"
})