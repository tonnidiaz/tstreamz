export const GET = async ({ url }) => {
    const all = url.searchParams.get("all");
    const { TuVid } = await import("@cmn/utils/tu-wwe/models");
    const r =
        all == "true"
            ? await TuVid.deleteMany({})
            : await TuVid.deleteMany({ title: undefined }).exec();
    return new Response(`[${r.deletedCount}] videos deleted`);
};
