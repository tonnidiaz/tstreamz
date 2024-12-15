import { tuErr } from "@/lib/server/funcs.js";
import { Visitor } from "@/lib/server/models/index.js";
import { json } from "@sveltejs/kit";

export const GET = async ({ url }) => {
    const { ip } = Object.fromEntries(url.searchParams);
    const visitors = await Visitor.find().exec();
    return json(visitors.map((el) => el.toJSON()));
};

export const POST = async ({ url, request: req }) => {
    const { act } = Object.fromEntries(url.searchParams);
    const data = await req.json();

    console.log(`\n/visitors`, { act, ip: data.ip, ts: data.ts });
    const visitor =
        (await Visitor.findOne({
            ip: data.ip,
            location: data.location,
            device: data.device,
        }).exec()) || (act == "update" ? null : new Visitor({ ip: data.ip }));
    if (!visitor) {
        console.log(data);
        return tuErr(400, "No visitor with specified params")}
    if (act == "add") {
        visitor.visits += 1;
        visitor.entered_at = data.ts;
        for (let k of Object.keys(data)) {
            visitor.set(k, data[k]);
        }
    } else if (act == "update") {
        visitor.left_at = data.ts;
        visitor.time += visitor.left_at - visitor.entered_at;
    }
    await visitor.save();
    return json(visitor.toJSON());
};
