import { dev } from "$app/environment"
import { connectMongo } from "@cmn/utils/bend/funcs"

const main = async () =>{
    await connectMongo(dev, "tuheadlines")
}

main()