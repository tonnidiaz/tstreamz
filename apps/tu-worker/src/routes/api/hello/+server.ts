import { db } from "@cmn/utils/tu-wwe/models";
import { json } from "@sveltejs/kit";

export const GET = () =>{
    console.log(db?.readyState);
    console.log(db?.modelNames());
    return json({hello: "John"})
}