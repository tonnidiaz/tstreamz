import { offline } from '@/lib/constants.js';
import { dummyMovieMeta } from '@/lib/consts2.js';
import { getMeta, tuErr } from '@/lib/server/funcs';
import { error, json } from '@sveltejs/kit';

export const GET = async ({url, params}) =>{
    const { id } = params
    const meta = offline ? dummyMovieMeta : await getMeta(id);
    return meta ? json({meta}) : tuErr(500, "Could not get meta")
}