import * as cheerio from "cheerio";
import { IMetadata } from "./interfaces";
import { isValidURL, parseDate } from "@cmn/utils/funcs";
import { Metadata } from "next";

export async function parseMetadata(
    url: string,
    html: string
): Promise<IMetadata> {
    const $ = cheerio.load(html);
    const meta: IMetadata = {
        url,
        title: $("title").text(),
        favicon: $('link[rel="icon"]').attr("href"),
        description: $('meta[name="description"]').attr("content"),
        og: {
            title: $('meta[property="og:title"]').attr("content"),
            description: $('meta[property="og:description"]').attr("content"),
            images: $('meta[property="og:image"]').attr("content"),
            url: $('meta[property="og:url"]').attr("content"),
        },
        twitter: {
            title: $('meta[name="twitter:title"]').attr("content"),
            description: $('meta[name="twitter:description"]').attr("content"),
            images: $('meta[name="twitter:image"]').attr("content"),
            card: "summary_large_image",
            site: "@site"
        },
    };
    return meta;
}

export const validateMetatags: (meta: IMetadata) => IMetadata = (meta) => {
    if (!meta?.url) return meta;
    const links = ["favicon", "ogUrl", "ogImage", "twitterImage"];
    const { origin } = new URL(meta.url);
    for (let k of links) {
        if (meta[k]) {
            const v: string = meta[k];
            if (k == "favicon" && v.startsWith("./")) {
                meta[k] = v.replace("./", "/");
            }

            if (v.startsWith("/") || !isValidURL(v)) {
                // prepend the origin
                meta[k] = origin + meta[k];
            }
        }
    }

    return meta;
};


export const genHtmlMetatags = (meta: IMetadata) =>{

    const {og, twitter} =  meta
    let metatags = ""
    if (meta.title) metatags += `<title>${meta.title}</title>`
    if (meta.description) metatags += `\n<meta name="description" content="${meta.description}"/>`
    if (og){
        if (og.title) metatags += `\n<meta property="og:title" content="${og.title}"/>`
        if (og.description) metatags += `\n<meta property="og:description" content="${og.description}"/>`
        if (og.url) metatags += `\n<meta property="og:url" content="${og.url}"/>`
        if (og.images) metatags += `\n<meta property="og:image" content="${og.images}"/>`
    }
    if (twitter){
        metatags += `\n<meta name="twitter:card" content="summary_large_image"`
        if (twitter.title) metatags += `\n<meta name="twitter:title" content="${twitter.title}"/>`
        if (twitter.description) metatags += `\n<meta name="twitter:description" content="${twitter.description}"/>`
        if (twitter.images) metatags += `\n<meta name="twitter:image" content="${twitter.images}"/>`
    }
    return metatags
}

export const genNextjsMetatags = (meta: IMetadata)=>{
    const {og, twitter} =  meta
    let metatags: Metadata = {title: meta.title, description: meta.description, openGraph: {...og}, twitter: {...twitter}}
    return JSON.stringify(metatags)
    
}