import { handleErrs, timedLog } from "@cmn/utils/funcs";
import { tuErr } from "@repo/ui-next/lib/funcs";
import { spawn } from "child_process";
import ffmpeg from "fluent-ffmpeg";
import { PassThrough, Readable } from "stream";
import youtubeDl from "youtube-dl-exec";

export const GET = async () => {
    timedLog("[FFMPEG] Download starting");
    const filename = `tu_video-${Date.now()}.mp4`;
    const url =
        "https://rr3---sn-8vq5jvh15-2gts.googlevideo.com/videoplayback?expire=1739378148&ei=hHmsZ8HnHeKIvdIPrdyhkAk&ip=105.245.101.123&id=o-AG0Qswc6vR-xwrVH7TWDcfqbxkckPlPTDwybUEspnMx0&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&met=1739356548%2C&mh=o6&mm=31%2C29&mn=sn-8vq5jvh15-2gts%2Csn-8vq5jvh15-wocl&ms=au%2Crdu&mv=m&mvi=3&pl=18&rms=au%2Cau&initcwndbps=521250&bui=AUWDL3xRx9I_ckqwMw_Kn8lTGKtXn8BibHXmCBl3jhiaNNKWsNPCSDir3yPkptdRez27LKWDmUwBWIGJ&spc=RjZbSeVaaZwgRra6gJt-6ZBzzKdmbATUgzGlsu4n55vF8mXApjmW4n-zE5ovqlkEwYorVVI&vprv=1&svpuc=1&mime=video%2Fmp4&ns=XqSfRsECN4sHV1EcRl-N5WsQ&rqh=1&cnr=14&ratebypass=yes&dur=60.209&lmt=1736968049321636&mt=1739356139&fvip=1&fexp=51326932&c=WEB_EMBEDDED_PLAYER&sefc=1&txp=4438534&n=Rc2Fc1cgZxcaxg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Ccnr%2Cratebypass%2Cdur%2Clmt&lsparams=met%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms%2Cinitcwndbps&lsig=AGluJ3MwRgIhAO_n_5UJhUr5hT0Xe0jfguEGZSFt1VQl5olBhsJudtJfAiEAkqGoRK_7RsjL0teLrb7dRof9DRvcKnNy8UWODaI2Y34%3D&sig=AJfQdSswRQIhAOs9aqkponLn2Lvmr6ozVink7wHC5q0m7Q2Wcqp3c7lWAiA5tnnudPTi4JK1fwX0182iYkeeKxo3-af4omu_yvaQaA%3D%3D";
    const url2 =
        "https://rr5---sn-woc7knes.googlevideo.com/videoplayback?expire=1739365604&ei=hEisZ_SzEJH4xN8PjMmaaQ&ip=41.13.76.234&id=o-AO4w_RRArrfouzYHh46hbsxYCitEd_W5hAyGCGD-I9Q_&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&bui=AUWDL3ybhDV0vK201xqHFdMNfoytCTWxkdey1VWEuUL1qit-FGThLJaNntAxJ9oNSp40ZahQ6Pbe4hGc&spc=RjZbSforBBiyUoNKvvThu1PK9DkrcWFYQOD7wy-npQVMpq892XJt4aI6mMN2vQ8&vprv=1&svpuc=1&mime=video%2Fmp4&ns=W-__qljWbnYZ7BKeCWelH1UQ&rqh=1&cnr=14&ratebypass=yes&dur=246.247&lmt=1699428393975573&lmw=1&fexp=24350590,24350737,24350825,24350827,24350961,24350977,24350978,24351028,24351063,24351082,24351148,24351183,51326932&c=TVHTML5&sefc=1&txp=4438434&n=qCLdqpOEuDAh1A&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRQIgY3ysWADH0Ggi41IoTc-H2OXWHEwB8cljl9DL1w0vwc8CIQDGMIyekih-3sHbipIFJBFLXvqTbsiaOtczg4ZHQBhHgw%3D%3D&cm2rm=sn-8vq5jvh15-2gts7l,sn-8vq5jvh15-wocl7e&rrc=80,104,80&req_id=a81f956d491ba3ee&rm=sn-wocek76&ipbypass=yes&redirect_counter=3&cms_redirect=yes&cmsv=e&met=1739356085,&mh=Mb&mip=105.245.101.123&mm=30&mn=sn-woc7knes&ms=nxu&mt=1739355882&mv=m&mvi=5&pl=18&rms=nxu,au&lsparams=ipbypass,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=AGluJ3MwRAIgBdws08eve5F2ZUOU9g-A7GSOhFEPdKElK_jgU-DKbu4CICOnXgrQoov_y2K3dWZEjhJ3rQVNGW2E1GX8rAspRj4w";
    const ytURL = "https://www.youtube.com/watch?v=6xKWiCMKKJg";
    let isDownloading = false;
    try {
        const stream = new PassThrough();
        const process = spawn("src/bin/yt-dlp", ["-f", "b", "-o", "-", url]);

        await new Promise((res, rej) => {
            process.on("error", (err) => {
                handleErrs(err);
                rej(err);
            });
            process.on("message", (m) => {
                console.log("[ON_MESSAGE]", m);
            });
            process.stdout.on("data", d=>{
                // console.log("[ON_DATA]", d);
                res(d)
            })
            process.stdout.pipe(stream); // Stream video output
            process.stderr.on("data", (data) =>
                console.error("yt-dlp error:", data.toString())
            );
        });

        return new Response(PassThrough.toWeb(stream).readable, {
            headers: {
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Type": "video/mp4",
                // "Transfer-Encoding": "chunked", // Ensure real-time streaming
                "Accept-Ranges": "bytes",
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (err) {
        handleErrs(err);
        return tuErr("Fuck this ish");
    }
};
