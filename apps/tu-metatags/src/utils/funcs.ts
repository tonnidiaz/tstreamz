import * as cheerio from "cheerio";
import { IMetadata } from "./interfaces";

export async function parseMetadata(url: string,html: string): Promise<IMetadata> {
    const $ = cheerio.load(html);
    const meta: IMetadata = {
        url,
        canonical: url,
        title: $("title").text(),
        description: $('meta[name="description"]').attr("content") || "",
        ogTitle: $('meta[property="og:title"]').attr("content") || "",
        ogDescription:
            $('meta[property="og:description"]').attr("content") || "",
        ogImage: $('meta[property="og:image"]').attr("content") || "",
        ogUrl: $('meta[property="og:url"]').attr("content") || "",
        twitterTitle: $('meta[name="twitter:title"]').attr("content") || "",
        twitterDescription:
            $('meta[name="twitter:description"]').attr("content") || "",
        twitterImage: $('meta[name="twitter:image"]').attr("content") || "",
    }
    console.log({meta});
    return meta;
}
