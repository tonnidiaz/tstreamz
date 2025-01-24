import { dev } from "$app/environment";
import { connectMongo } from "@cmn/utils/bend/funcs";
import { handleError } from "@repo/ui/hooks.server";

const main = async () =>{
    await connectMongo(dev, "tu-wwe")
}

main()
export {handleError}