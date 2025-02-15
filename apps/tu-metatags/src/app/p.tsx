"use client";
import MetadataTool from "@/components/MetadataTool";
import { parseMetadata } from "@/utils/funcs";
import { IMetadata } from "@/utils/interfaces";
import { parseMeta } from "@/utils/server/funcs";
import { handleErrs } from "@cmn/utils/funcs";
import { showToast } from "@cmn/utils/funcs-ui";
import UButton from "@repo/ui-next/components/UButton";
import UForm from "@repo/ui-next/components/UForm";
import UInput from "@repo/ui-next/components/UInput";
import axios from "axios";
import { useEffect, useState } from "react";

const testMeta = {title:"Watch the lion king: Mufasa de rock. - Tunedstreamz",
    desc:`Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi veritatis eveniet voluptas nisi nulla pariatur tempore nostrum! Temporibus explicabo exercitationem quia velit quasi quibusdam consectetur quae dolorum sit odio? Unde?`,
    url:"https://www.tstreamz.xyz/movies", img: "/assets/images/meta-img.jpg"}
const Page = () => {
    const [url, setUrl] = useState("https://tstreamz.xyz/movies");
    
    const [metadata, setMetadata] = useState<IMetadata>({
        title: testMeta.title,
        description: testMeta.desc,
        canonical: testMeta.url,
        url: testMeta.url,
        ogUrl: testMeta.url,
        ogTitle: testMeta.title,
        twitterTitle: testMeta.title,
        twitterDescription: testMeta.desc,
        twitterImage: testMeta.title,
        ogDescription: testMeta.desc,
        ogImage: testMeta.img,
    });
    async function _parseMeta(url: string) {
        try {
            console.log("Parsing local meta...");
            const { data: html } = await axios.get(url);
            // console.log(html);
            return await parseMetadata(url, html);
        } catch (err) {
            handleErrs(err);
        }
    }
    const parseSite = async () => {
        console.log(url);

        const res = ["localhost", "127.0.0.1"].find(el=> url.includes(el))
            ? await _parseMeta(url)
            : await parseMeta(url);
        if (res) {
            setMetadata(res)
        } else {
            showToast({err: true, msg: "Failed to fetch site. Retry..."})
        }
    };

    // useEffect(()=>{setMetadata({...metadata, url})},[url])
    return (
        <div className="p-4 oy-scroll w-full h-full flex-col gap-2">
            <div className="w-600px m-auto">
                <h1 className="title">Tu metatags tool</h1>
                <UForm className="my-4" onSubmit={parseSite}>
                    <UInput
                        placeholder="Enter url..."
                        required
                        value={url}
                        type="url"
                        onChange={({ target }) => setUrl(target.value)}
                        trailing={
                            <UButton
                                showLoader
                                type="submit"
                                className="btn-primary"
                            >
                                Submit
                            </UButton>
                        }
                    />
                </UForm>
            </div>

            <div className="my-4 flex-1">
                <MetadataTool url={url} metadata={metadata} setMetadata={setMetadata}/>
            </div>
        </div>
    );
};

export default Page;
