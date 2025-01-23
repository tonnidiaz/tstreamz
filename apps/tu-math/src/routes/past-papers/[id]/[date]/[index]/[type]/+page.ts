import { api } from '@/lib/api.js';

export const load = async ({params, url}) =>{
    const {data} = await api.get(`${url.origin}/api/past-papers`, {params})
    console.log(data)
}