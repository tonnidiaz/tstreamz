import { apiJson } from '@repo/ui-next/lib/funcs';
import { cookies } from 'next/headers'

export const GET = async(req: Request)=>{
    
    const cookieStore = await cookies()
    console.log(cookieStore.getAll());
    return apiJson({hello: 'TuWorld'})//new Response("Hello Tu World")
}