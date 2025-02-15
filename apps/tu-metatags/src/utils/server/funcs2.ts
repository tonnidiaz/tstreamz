import { sleep, timedLog } from "@cmn/utils/funcs"

export const genPost = async (id: string) =>{
    timedLog(`GENERATING POST FOR [${id}]...`)
    const ts = Date.now()
    const post = {name: `${Number(id) * 2} - ${ts}`, desc: `Post description generated at ${ts}`}
    await sleep(2500)
    return {post, ts}
}