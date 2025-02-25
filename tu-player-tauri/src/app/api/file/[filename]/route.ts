import { createReadStream } from "fs"
import { Readable } from "stream"

export const GET = async (req: Request, {params} : {params: Promise<{filename: string}>}) =>{
    const {filename} = await params
    const stream = createReadStream(filename)
    return new Response(Readable.toWeb(stream) as BodyInit, {headers: {'Accept-Ranges': 'bytes',}})
}