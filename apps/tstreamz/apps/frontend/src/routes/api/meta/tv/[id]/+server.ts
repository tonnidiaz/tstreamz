import { getMeta, tuErr } from '@/lib/server/funcs';
import { error, json } from '@sveltejs/kit';

export const GET = async ({url, params}) =>{
    const { id } = params
    const meta = await getMeta(id, true);
    return meta ? json({meta}) : tuErr(500, "Could not get meta")
}