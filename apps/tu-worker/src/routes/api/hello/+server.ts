
import { json } from "@sveltejs/kit";

export const GET = async () =>{
    const { db } = await import("@cmn/utils/tu-wwe/models");
    console.log(db?.readyState);
    console.log(db?.modelNames());
    return json({hello: "John"})
}