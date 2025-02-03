import { createTuStore } from "@repo/ui-next/store/utils";
import { appStore } from "./app";
import { IFilters, IJobExt } from "@/utils/interfaces";

export const store = {
    app: appStore,
    jobs: () =>
        createTuStore("jobs", {
            jobs: null as IJobExt[],
            filters: { sectors: [] } as IFilters,
        }),
};
