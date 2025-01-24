import { api } from "@/lib/api";
import { handleErrs, isTuError } from "@cmn/utils/funcs.js";
import type { IVideo } from "@cmn/utils/tu-wwe/interfaces";
import { error } from "@sveltejs/kit";
import { AxiosError } from "axios";

export const load = async ({ url, params }) => {
    const root = url.origin;
    const { id } = params;
    try {
        const { data } = await api.get(`${root}/api/videos/${id}`);
        const video: IVideo = data;

        return { video };
    } catch (err) {
        handleErrs(err);
        let status: number | undefined;
        let msg: string | undefined;
        if (err instanceof AxiosError) {
            status = err.status;
            // console.log("isAxiosErr", {status, msg});
        }
        error(status || 500, isTuError(err) || "Something went wrong");
    }
};
