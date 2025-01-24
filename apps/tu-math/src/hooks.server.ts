import { dev } from "$app/environment"
import { connectMongo } from "@cmn/utils/bend/funcs"
import { handleErrs, isTuError, timedLog } from "@cmn/utils/funcs"
import { handleError } from "@repo/ui/hooks.server"
import type { HandleServerError } from "@sveltejs/kit"

const main = async () =>{
    timedLog("\n[App Hook]")
    await connectMongo(dev, "tu-math")
}

export {handleError};
main()