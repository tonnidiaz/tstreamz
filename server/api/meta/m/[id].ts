import { getMeta } from "../../../../utils/functions";

export default defineEventHandler(async e =>{
    const { id } = getRouterParams(e)
    const meta = await getMeta(id);
    return {meta}
})