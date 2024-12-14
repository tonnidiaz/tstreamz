import { error, json } from "@sveltejs/kit";
export const GET = ()=>{
    return json({hello: "World"})
}