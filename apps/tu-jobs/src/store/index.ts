import { useTuState } from "@repo/ui-next/lib/tu";
import { createTuStore } from "./utils";


export const store = {
    app: () => createTuStore("app", { title: "Tu app", counter: 0 }),
};

