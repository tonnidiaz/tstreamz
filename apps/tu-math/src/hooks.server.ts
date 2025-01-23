import { dev } from "$app/environment"
import { connectMongo } from "@cmn/utils/bend/funcs"
import { handleErrs, isTuError, timedLog } from "@cmn/utils/funcs"
import type { HandleServerError } from "@sveltejs/kit"

const main = async () =>{
    timedLog("\n[App Hook]")
    await connectMongo(dev, "tu-math")
}

export const handleError: HandleServerError = async ({
    error,
    event,
    status,
    message,
}) => {
    handleErrs(error);
    return { message: "tu:" + (isTuError(error) || "Something went wrong"), status };
};


main()