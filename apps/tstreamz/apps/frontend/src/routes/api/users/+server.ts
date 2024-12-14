import { User } from "@/lib/server/models";
import { json } from "@sveltejs/kit";

export const GET = async ({url}) =>{
    const f = url.searchParams.get("f")
    const users = await User.find({});
    return json(users.map(el=> f ? el[f] : el.toJSON()))

}