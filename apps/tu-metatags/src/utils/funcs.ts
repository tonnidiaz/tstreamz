import * as cheerio from "cheerio";
import { IMetadata } from "./interfaces";
import { isValidURL, parseDate } from "@cmn/utils/funcs";

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
            image: $('meta[property="og:image"]').attr("content"),
            url: $('meta[property="og:url"]').attr("content"),
        },
        twitter: {
            title: $('meta[property="twitter:title"]').attr("content"),
            description: $('meta[property="twitter:description"]').attr("content"),
            image: $('meta[property="twitter:image"]').attr("content"),
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
