import { createTuStore } from "./utils";


export const store = {
    app: () => createTuStore("app", { title: "Tu app", counter: 0, ready: false }),
};

