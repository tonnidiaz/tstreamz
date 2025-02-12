import { timedLog } from "@cmn/utils/funcs";
import { createReadStream, statSync } from "node:fs";
import { Readable } from "node:stream";

const filepath =
    "/home/tonni/Downloads/USB/The.Bikeriders.2023.720p.WEBRip.x264.AAC-[YTS.MX].mp4";

export const GET = async (req: Request) => {

    timedLog("\nSDownload started...");
    const fstream = createReadStream(filepath);
    const filename = filepath.split("/").pop();
    const res = new Response(Readable.toWeb(fstream), {
        headers: {
            'Content-Length': statSync(filepath).size.toString(),
            "Content-Type": "video/mp4",
            'Accept-Ranges': 'bytes',
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });

    timedLog("\nSending response...")
    return res
};
