import { tuErr } from "@/lib/server/funcs.js"
import { updateUser, delUser } from "@/lib/server/funcs2"

export const POST = async ({params, url, request, locals}) =>{
    const { id, endpoint } = params
    const f = url.searchParams.get('f')
    const body = await request.json()
    if (!locals.user) return tuErr(401, 'Login to perform action')
    switch(endpoint){
        case "update":
            return updateUser(id, body, f)
        case "delete":
            return delUser(id)
    }
}


