import { json } from "@sveltejs/kit";

export const GET = async ({ url }) => {
    const {TuVid} = await import("@cmn/utils/tu-wwe/models")
    const { count, side, page, limit } = Object.fromEntries(url.searchParams);
    if (count == "true") {
        const dt = {
            raw: await TuVid.countDocuments({ side: "raw" }),
            smackdown: await TuVid.countDocuments({ side: "smackdown" }),
            all: await TuVid.countDocuments({}),
        };
        return json(dt);
    }

    const _limit = Number(limit),
        _page = Number(page);
    const skip = (_page - 1) * _limit;
    const vids = await TuVid.find({ side }).skip(skip).limit(_limit).exec();
    return json(vids.map(el=> el.toJSON()))
};
