"use server";

import ytdl from "@distube/ytdl-core";

export const getVideoInfo = async (url: string, isAudio = false) => {
    const r = await ytdl.getInfo(url);
    // console.log(r);
    const formats = r.formats.filter((el) =>
        (!isAudio ? el.hasVideo && el.hasAudio : el.hasAudio && !el.hasVideo
)  );
    return {
        title: r.videoDetails.title,
        channel: {name: r.videoDetails.ownerChannelName, id: r.videoDetails.channelId},
        thumbnail: r.videoDetails.thumbnails[0],
        duration: Number(r.videoDetails.lengthSeconds),
        formats,
    };
};

export async function dld({format, title, url} : {title: string, url: string, format: ytdl.videoFormat}) {
   
}