import { getTrailer, tuErr } from "@/lib/server/funcs";
import { json } from "@sveltejs/kit";

export const GET = async ({params}) =>{
    const { id } = params
    const data = await getTrailer(id, true);
  return data ? json({ trailer: data }) : tuErr(500, 'Could not get trailer');
}