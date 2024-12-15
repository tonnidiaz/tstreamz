import { Visitor } from '@/lib/server/models/index.js';
import { json } from '@sveltejs/kit';

export const GET = async ({url}) =>{
    const {ip} = Object.fromEntries(url.searchParams);
    const visitors = await Visitor.find().exec()
    return json(visitors.map(el=> el.toJSON()))

}

export const POST = async ({url, request: req}) =>{
    const {act} = Object.fromEntries(url.searchParams);
    const {ip, ts} = await req.json()

    console.log(`\n/visitors`, {act, ip});
    const visitor = await Visitor.findOne({ip}).exec() || new Visitor({ip});
    if (act == "add"){
        
        visitor.visits += 1
        visitor.entered_at = ts
    }else if (act == "update"){
        visitor.time += ts - visitor.entered_at
    }
    await visitor.save()
    return json(visitor.toJSON())
}