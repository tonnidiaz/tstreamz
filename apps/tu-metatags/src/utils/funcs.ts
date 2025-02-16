import * as cheerio from "cheerio";
import { IMetadata } from "./interfaces";
import { isValidURL, parseDate } from "@cmn/utils/funcs";

export async function parseMetadata(url: string,html: string): Promise<IMetadata> {
    const $ = cheerio.load(html);
    const meta: IMetadata = {
        url,
        canonical: url,
        title: $("title").text(),
        favicon: $('link[rel="icon"]').attr("href"),
        description: $('meta[name="description"]').attr("content"),
        ogTitle: $('meta[property="og:title"]').attr("content"),
        ogDescription:
            $('meta[property="og:description"]').attr("content"),
        ogImage: $('meta[property="og:image"]').attr("content"),
        ogUrl: $('meta[property="og:url"]').attr("content"),
        twitterTitle: $('meta[name="twitter:title"]').attr("content"),
        twitterDescription:
            $('meta[name="twitter:description"]').attr("content"),
        twitterImage: $('meta[name="twitter:image"]').attr("content"),
    }
    return meta;
}


export const validateMetatags: (meta: IMetadata) => IMetadata = (meta)=>{
    if (!meta) return meta;
    const links = ['favicon', 'ogUrl', 'ogImage', 'twitterImage']
    const {origin} = new URL(meta.url)
    for (let k of links){
        if (meta[k]){
            const v: string = meta[k]
            if (k == "favicon" && v.startsWith("./")){
                meta[k] = v.replace("./", "/")
            }

            if (v.startsWith("/") || !isValidURL(v)){
                // prepend the origin
                meta[k] = origin + meta[k]
            }
        }
    }

    return meta
}