import { handleErrs, timedLog } from "@cmn/utils/funcs";
import ffmpeg from "fluent-ffmpeg";
import youtubedl, {exec} from 'youtube-dl-exec'

const main = async () => {
    try {
        const url =
            "https://rr3---sn-8vq5jvh15-2gts.googlevideo.com/videoplayback?expire=1739378148&ei=hHmsZ8HnHeKIvdIPrdyhkAk&ip=105.245.101.123&id=o-AG0Qswc6vR-xwrVH7TWDcfqbxkckPlPTDwybUEspnMx0&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&met=1739356548%2C&mh=o6&mm=31%2C29&mn=sn-8vq5jvh15-2gts%2Csn-8vq5jvh15-wocl&ms=au%2Crdu&mv=m&mvi=3&pl=18&rms=au%2Cau&initcwndbps=521250&bui=AUWDL3xRx9I_ckqwMw_Kn8lTGKtXn8BibHXmCBl3jhiaNNKWsNPCSDir3yPkptdRez27LKWDmUwBWIGJ&spc=RjZbSeVaaZwgRra6gJt-6ZBzzKdmbATUgzGlsu4n55vF8mXApjmW4n-zE5ovqlkEwYorVVI&vprv=1&svpuc=1&mime=video%2Fmp4&ns=XqSfRsECN4sHV1EcRl-N5WsQ&rqh=1&cnr=14&ratebypass=yes&dur=60.209&lmt=1736968049321636&mt=1739356139&fvip=1&fexp=51326932&c=WEB_EMBEDDED_PLAYER&sefc=1&txp=4438534&n=Rc2Fc1cgZxcaxg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Ccnr%2Cratebypass%2Cdur%2Clmt&lsparams=met%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms%2Cinitcwndbps&lsig=AGluJ3MwRgIhAO_n_5UJhUr5hT0Xe0jfguEGZSFt1VQl5olBhsJudtJfAiEAkqGoRK_7RsjL0teLrb7dRof9DRvcKnNy8UWODaI2Y34%3D&sig=AJfQdSswRQIhAOs9aqkponLn2Lvmr6ozVink7wHC5q0m7Q2Wcqp3c7lWAiA5tnnudPTi4JK1fwX0182iYkeeKxo3-af4omu_yvaQaA%3D%3D";
        ffmpeg(url)
            .format("mp4")
            .videoCodec("libx264")
            .addOption(["-preset", "ultrafast"])
            .output(`output-${Date.now()}.mp4`)
            // .videoCodec("libx264")
            // .preset("fast")
            .on("start", () => timedLog("Begin processing...."))
            .on("progress", (p) => timedLog("processing", `[${p.currentKbps}]...`))
            .on("end", () => console.log("Processing finished!"))
            .on("error", (err) => console.error("Error: " + err.message))
            .run();
    } catch (err) {
        handleErrs(err);
    }
};

const mainYt = async ()=>{
    console.log("START");
    exec('https://www.youtube.com/watch?v=6xKWiCMKKJg', {
        // exec: "src/bin/yt-dlp",
        output: "out.mp4",
        
        // dumpSingleJson: true,
        // noCheckCertificates: true,
        // noWarnings: true,
        // preferFreeFormats: true,
        
        addHeader: ['referer:youtube.com', 'user-agent:googlebot']
      }).then(output => {console.log(output.connected)
        output.on("message", msg=>{
            console.log("[ON_MESSAGE]", msg);
        })
        .on("error", err=>{
            console.log("[ON_ERROR]", err);
        })

      }).catch(err=>{
        console.log(err);
      })
}

mainYt()