import { handleErrs, timedLog } from "@cmn/utils/funcs";
import { apiJson, tuErr } from "@repo/ui-next/lib/funcs";
import { RequestHandler } from "next/dist/server/next";
import ytdl from "@distube/ytdl-core";
import { NextApiRequest, NextApiResponse } from "next";
import { promisify } from "util";
import { Readable } from "stream";
import axios from "axios";
import { format } from "path";
import { createReadStream } from "fs";
import https from "https";

const get = promisify(https.get); // Convert callback-based https.get() to a promise

async function fetchStream(url: string, maxRedirects = 5) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
            if ([301, 302, 307, 308].includes(res.statusCode)) {
                if (maxRedirects === 0) {
                    return reject(new Error("Too many redirects"));
                }
                const redirectUrl = res.headers.location;
                return resolve(fetchStream(redirectUrl, maxRedirects - 1)); // Follow redirect
            }

            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to fetch video: ${res.statusCode}`));
            }

            resolve(Readable.from(res));
        }).on("error", reject);
    });
}


export const GET = async (req: Request, { params }) => {
    timedLog("\nDownloading....");
    try {
        let { url, size } = Object.fromEntries(
            new URL(req.url).searchParams
        );

        url = decodeURIComponent(url)
        const filename = `videofile-${Date.now()}.mp4`;
        
        // console.log(JSON.parse(format));
        // const videoStream = createReadStream(url)//ytdl (url);
        const options = {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Referer": "https://www.youtube.com/", // Change this if needed
            },
        };

        // return new Response(url)
        const videoStream: Readable = await fetchStream(url) as Readable/*  new Promise((resolve, reject) => {
            https.get(url, options, (res) => {
                console.log("\n", res.statusCode);
                const msg = `Failed to fetch video from: ${url}\n`
                timedLog(msg)
                if (res.statusCode !== 200) return reject(new Error(msg));
                resolve(Readable.from(res));
            }).on("error", reject);
        }); */

        videoStream.on("data", (d) => {
            timedLog("On data");
        });
        videoStream.on("error", (err) => {
            timedLog("On error");
            handleErrs(err);
        });

        // Convert Node.js Readable stream into a Web API ReadableStream
        const stream = Readable.toWeb(videoStream)
        timedLog("Stream created")
        const res = new Response(stream, {
            status: 206,
            headers: {
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Type": "video/mp4",
            "Content-Length": size,
            // "Transfer-Encoding": "chunked", // Ensure real-time streaming
            'Accept-Ranges': 'bytes',
            "Access-Control-Allow-Origin": "*"
        } })
        timedLog("SENDING RESPONSE...");
        // response.data.pipe(fs.createWriteStream(outputPath));
    
        return res
        // const {format, url, title} = await req.json()
        // const filename = `tu-yt_${title}.${format.container}`;
        // // Set response headers
        // const headers = new Headers();
        // headers.append('Content-Disposition', `attachment; filename="${filename}"`);
        // headers.append('Content-Type', 'video/mp4');

        // // console.log(res);
        // // res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        // const stream = ytdl(url, {format})
        // console.log({title, url, format});
        // // const webStream = await pipeline(stream)
        // const res = new Response( Readable.toWeb(stream), {headers})
        // console.log(res.ok);
        // return res
    } catch (err) {
        handleErrs(err);
        return tuErr("Fuck this shit", 500);
    }
};
