import { dev } from "$app/environment"
import { connectMongo } from "@cmn/utils/bend/funcs"
import { timedLog } from "@cmn/utils/funcs"

const main = async () =>{
    timedLog("\n[App Hook]")
    await connectMongo(dev, "tu-math")
}

main()