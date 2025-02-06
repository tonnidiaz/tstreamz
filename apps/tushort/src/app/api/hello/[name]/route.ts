import { sleep } from "@cmn/utils/funcs";
import { apiJson, tuErr } from "@repo/ui-next/lib/funcs"
import { TuApiHandler } from "@repo/ui-next/lib/interfaces"
import { NextRequest } from "next/server";
export const GET : TuApiHandler = async (req: NextRequest, {params}) =>{
    const {name}= await params;
    console.log('\n', {name});
    await sleep(3000)
    if (name !== "tonni") return tuErr("User not found", 404)
    return apiJson({hello: `Mr ${name}`})
}