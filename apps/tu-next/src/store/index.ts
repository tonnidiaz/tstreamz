import { createTuStore } from "@repo/ui-next/store/utils";
import { appStore } from "./app";

export const store = {
    app: appStore,
    app2: ()=>createTuStore("app2", {
        counter: 0
    }),
}