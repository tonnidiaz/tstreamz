"use client";
import { getVideoInfo } from "@/utils/server/funcs2";
import {
    formatDuration,
    formatNum,
    handleErrs,
    isTuError,
} from "@cmn/utils/funcs";
import { showToast } from "@cmn/utils/funcs-ui";
import ytdl from "@distube/ytdl-core";
import TuLink from "@repo/ui-next/components/TuLink";
import UButton from "@repo/ui-next/components/UButton";
import UForm from "@repo/ui-next/components/UForm";
import UFormGroup from "@repo/ui-next/components/UFormGroup";
import UInput from "@repo/ui-next/components/UInput";
import axios from "axios";
import { useEffect, useState } from "react";

const testInfo = {"title":"Pokémon Season 1: Indigo League - Opening Theme","channel":{"name":"ThePokemonNetwork","id":"UCMzdPhimosu0P8kY6lGEIug"},"thumbnail":{"url":"https://i.ytimg.com/vi/6xKWiCMKKJg/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLC3sQy1CMq9zj4j5ByGTfP9_FaaoQ","width":168,"height":94},"duration":61,"formats":[{"mimeType":"video/mp4; codecs=\"avc1.42001E, mp4a.40.2\"","qualityLabel":"360p","bitrate":402371,"audioBitrate":96,"itag":18,"width":480,"height":360,"lastModified":"1736968049321636","quality":"medium","fps":13,"projectionType":"RECTANGULAR","audioQuality":"AUDIO_QUALITY_LOW","approxDurationMs":"60209","audioSampleRate":"44100","audioChannels":2,"url":"https://rr3---sn-8vq5jvh15-2gts.googlevideo.com/videoplayback?expire=1739327794&ei=0rSrZ-_cMeX6xN8Pro75gA8&ip=41.13.104.122&id=o-AKF_BWNs9v5OycJjv3uNlFnx1MZfSmUAiun1t_gLGrAQ&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&met=1739306194%2C&mh=o6&mm=31%2C29&mn=sn-8vq5jvh15-2gts%2Csn-woc7knel&ms=au%2Crdu&mv=m&mvi=3&pl=19&rms=au%2Cau&initcwndbps=356250&bui=AUWDL3yTzBTRWyUAD8hufZFgh2vJIOEN_qNtPmNbRucP91ICR0gYUV7VlGz4Hq5jSybd9g0cqjMR9vlb&spc=RjZbSTgWxANB5Kzth0eaVwAbAbS5YI8V0zHml2r4odVDuLqGifuXfxLh3Ua8i08&vprv=1&svpuc=1&mime=video%2Fmp4&ns=XxykZ5pbPLxBFAY9qjjB8jsQ&rqh=1&cnr=14&ratebypass=yes&dur=60.209&lmt=1736968049321636&mt=1739305990&fvip=1&fexp=51326932&c=WEB_EMBEDDED_PLAYER&sefc=1&txp=4438534&n=Ol4Ctp5AjxLYkw&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Ccnr%2Cratebypass%2Cdur%2Clmt&lsparams=met%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms%2Cinitcwndbps&lsig=AGluJ3MwRAIgC_niwZmr7VgZ4HWGjroCTmLhtjU7rWWwFiJK2OO1x2ACIC8WcJZhb2Jk70YVD_m_ZXh7MI72Osryas7Im4rbIOmu&sig=AJfQdSswRQIhAJzrhW8Z2TYIchgZFoyMtPWWQPoGsgp7vd-yIdifGBPuAiBtk1QJvG1JiZxJkVfu1k-K4jGadG_mi5DUqzadND6Xxw%3D%3D","hasVideo":true,"hasAudio":true,"container":"mp4","codecs":"avc1.42001E, mp4a.40.2","videoCodec":"avc1.42001E","audioCodec":"mp4a.40.2","isLive":false,"isHLS":false,"isDashMPD":false},{"mimeType":"video/mp4; codecs=\"avc1.42001E, mp4a.40.2\"","qualityLabel":"360p","bitrate":402371,"audioBitrate":96,"itag":18,"width":480,"height":360,"lastModified":"1736968049321636","quality":"medium","fps":13,"projectionType":"RECTANGULAR","audioQuality":"AUDIO_QUALITY_LOW","approxDurationMs":"60209","audioSampleRate":"44100","audioChannels":2,"url":"https://rr3---sn-8vq5jvh15-2gts.googlevideo.com/videoplayback?expire=1739327794&ei=0rSrZ9OcKaPkxN8P7dyIwAw&ip=41.13.104.122&id=o-AIqjEm7XZtq5J__yy3gL7JSFgPdP46smo3wU_IicPLy1&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&met=1739306194%2C&mh=o6&mm=31%2C29&mn=sn-8vq5jvh15-2gts%2Csn-woc7knel&ms=au%2Crdu&mv=m&mvi=3&pl=19&rms=au%2Cau&initcwndbps=356250&bui=AUWDL3xZwxTBsV0JvN9ucjVKawxChe49ilGrhr6o_A7hS-2dx63vDRNd82wxuY7Ial8hVrodboFpGROj&spc=RjZbSbuCpd9-UkCbbWmHdDiDoPjMV7PVxBtgc4a6PB7EtN812yyxHMLl70HHpICliA&vprv=1&svpuc=1&mime=video%2Fmp4&ns=4GICyiaIaB4LgIxpIsiDyiAQ&rqh=1&cnr=14&ratebypass=yes&dur=60.209&lmt=1736968049321636&mt=1739305990&fvip=1&lmw=1&fexp=51326932&c=TVHTML5&sefc=1&txp=4438534&n=pYLeVGWG5REh3w&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Ccnr%2Cratebypass%2Cdur%2Clmt&lsparams=met%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms%2Cinitcwndbps&lsig=AGluJ3MwRQIgI4C8Fik2Jv8EuiV4OK541L7UvPJ__UKwggre4PxhxIECIQDjYefOZi53f4123x4iy35IM5XJ3qm-N--XXCgOULRSVg%3D%3D&sig=AJfQdSswRQIhAP6lzROQx6vy0cZ1uqbumVaiamFyRKYz60xRP2ljJWLzAiAovj5vFJYekm54eoN3nCr_KR2lExsiI8Qyk-psEj48tw%3D%3D","hasVideo":true,"hasAudio":true,"container":"mp4","codecs":"avc1.42001E, mp4a.40.2","videoCodec":"avc1.42001E","audioCodec":"mp4a.40.2","isLive":false,"isHLS":false,"isDashMPD":false},{"mimeType":"video/mp4; codecs=\"avc1.42001E, mp4a.40.2\"","qualityLabel":"360p","bitrate":402371,"audioBitrate":96,"itag":18,"url":"https://rr3---sn-8vq5jvh15-2gts.googlevideo.com/videoplayback?expire=1739327791&ei=z7SrZ9_JK5mIvdIPjIiksQM&ip=41.13.104.122&id=o-AISLAigNVxEBDiQv2RmPW3ODDDCX8dyFctFTX7UiRI7W&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&met=1739306191%2C&mh=o6&mm=31%2C29&mn=sn-8vq5jvh15-2gts%2Csn-woc7knel&ms=au%2Crdu&mv=m&mvi=3&pl=19&rms=au%2Cau&initcwndbps=376250&bui=AUWDL3wa4pWsoQsxag90p-mQdpkXJtKOMod22AiaIA1irXXZGuxdy0LfME-2odnmlSXC1FtckZXVZQQb&spc=RjZbSU8P4OyHa-tHzr0zmuZqUx7v8E54kJ7sfDdgdbRIzvCeMwWzE0G2fo6GG8Eiqu5j&vprv=1&svpuc=1&mime=video%2Fmp4&rqh=1&cnr=14&ratebypass=yes&dur=60.209&lmt=1736968049321636&mt=1739305754&fvip=1&fexp=51326932&c=ANDROID&txp=4438534&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Crqh%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRgIhAIVHqLkiGplI3L7kxoKCVA5fQByUnYQqIV9l6ofcV-w1AiEArZ1ZCOy21g0DAxSbX6PuPy_pbJNnOeiZPU6I-zwdtYI%3D&lsparams=met%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms%2Cinitcwndbps&lsig=AGluJ3MwRQIhAIX2WPgITVpRnTvzpgaPtlwZJ9VO1Sh-ucOWVFjC94B8AiA_RnLJCjYkWa0tsaisMaIPA5spC8ejl4MquQ0buOv1Uw%3D%3D","width":480,"height":360,"lastModified":"1736968049321636","quality":"medium","fps":13,"projectionType":"RECTANGULAR","audioQuality":"AUDIO_QUALITY_LOW","approxDurationMs":"60209","audioSampleRate":"44100","audioChannels":2,"hasVideo":true,"hasAudio":true,"container":"mp4","codecs":"avc1.42001E, mp4a.40.2","videoCodec":"avc1.42001E","audioCodec":"mp4a.40.2","isLive":false,"isHLS":false,"isDashMPD":false}]}

const videoInfoKey = "video-info";
const Page = () => {
    const [url, setUrl] = useState(
        "https://www.youtube.com/watch?v=6xKWiCMKKJg"
    );
    const [videoInfo, setVideoInfo] = useState<{
        title: string;
        thumbnail: ytdl.thumbnail;
        duration: number;
        channel: { name: string; id: string };
        formats: ytdl.videoFormat[];
    } | null>();

    const _getVideoInfo = async () => {
        try {
            setVideoInfo(null);
            console.log({url});
            const r = await getVideoInfo(url);
            console.log(r.formats.map(el=> ({container: el.container, len: el.contentLength})));
            setVideoInfo(r);
        } catch (err) {
            handleErrs(err);
            showToast({
                msg: isTuError(err) || "Failed to get video info",
                err: true,
            });
        }
    };

    useEffect(() => {
        const _videoInfo = localStorage.getItem(videoInfoKey);
        if (_videoInfo && _videoInfo != "undefined" && _videoInfo != "null")
            setVideoInfo(JSON.parse(_videoInfo));
    }, []);
    useEffect(() => {
        localStorage.setItem(videoInfoKey, JSON.stringify(videoInfo));
    }, [videoInfo]);

    async function dld(format: ytdl.videoFormat) {
    //    const r = await axios.get("/api/dld",{params: {title: videoInfo.title, url, format}}, )
    //    const r = await axios.get("/api/dld",{params: {url, format: JSON.stringify(format)}}, )
    const formatUrl = encodeURIComponent(format.url)
    const r = `${location.origin}/api/dld?url=${formatUrl}&size=${Number(format.contentLength) / 1024}`
    console.log(format.url);
    console.log(format.contentLength, r);
    }

    return (
        <div className="p-4 w-full">
            <div className="m-auto p-3 bordered rounded-md w-600px">
                <h1 className="fs-20 fw-6 text-center">
                    Youtube video downloader
                </h1>
                <p>[{url}]</p>
                <UForm onSubmit={_getVideoInfo} className="mt-4">
                    <UFormGroup label="Enter/paste video url">
                        <UInput
                            type="url"
                            required
                            onChange={(e) => setUrl(e.target.value)}
                            value={url}
                            className="input-md fs-14"
                            placeholder="e.g https://www.youtube.com/watch?v=6xKWiCMKKJg"
                            trailing={
                                <UButton
                                    showLoader
                                    type="submit"
                                    className="btn-sm btn-primary"
                                >
                                    Convert
                                </UButton>
                            }
                        />
                    </UFormGroup>
                </UForm>

                {videoInfo && (
                    <div className="mt-4 p-3 rounded-md bordered">
                        <h3 className="ttl">
                            Results for:{" "}
                            <span className="text-secondary">
                                {videoInfo.title}
                            </span>
                        </h3>
                        <div className="mt-3 flex gap-2 items-start">
                            <div className="w-150px">
                                <img
                                    style={{ objectFit: "contain" }}
                                    src={videoInfo.thumbnail.url}
                                    alt=""
                                />
                            </div>
                            <div className="flex-1 fs-14">
                                <h4>{videoInfo.title}</h4>
                                <p>
                                    <span className="text-white-0 fw-6">
                                        Duration:{" "}
                                    </span>{" "}
                                    <span className="text-secondary">
                                        {formatDuration(videoInfo.duration)}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-white-0 fw-6">
                                        Channel:{" "}
                                    </span>{" "}
                                    <TuLink
                                        target="_blank"
                                        className="text-secondary"
                                        to={`https://www.youtube.com/${videoInfo.channel.id}`}
                                    >
                                        {videoInfo.channel.name}
                                    </TuLink>
                                </p>
                            </div>
                        </div>
                        <div className="w-full p-2 rounded-md bordered mt-3">
                            <h4 className="fs-20">Formats</h4>
                            <div className="mt-3 w-full flex-col gap-2">
                                {videoInfo.formats.map((format, i) => (
                                    <div
                                        key={`format-${i}`}
                                        className="flex gap-2 justify-between items-center"
                                    >
                                        <p>
                                            {format.quality}{" "}
                                            <span>{format.qualityLabel}</span>
                                        </p>
                                        <UButton
                                            onClick={async () =>
                                                await dld(format)
                                            }
                                            className="btn-secondary"
                                        >
                                            <i className="fi fi-sr-download"></i>
                                        </UButton>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
