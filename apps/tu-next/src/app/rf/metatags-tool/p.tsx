"use client";
import { parseMeta } from "@/utils/server/funcs";
import UButton from "@repo/ui-next/components/UButton";
import UForm from "@repo/ui-next/components/UForm";
import UInput from "@repo/ui-next/components/UInput";
import { useState } from "react";

const Page = () => {
    const [url, setUrl] = useState("https://tstreamz.xyz/movies");
    const [title, setTitle] = useState("");


    const parseSite = async () =>{
        setTitle("")
        console.log(url);
        const res = await parseMeta(url)
        if (res){
            setTitle(res.title)
        }
    }
    return (
        <div className="p-4">
            <h1 className="title">Tu metatags tool</h1>
            <UForm className="my-4" onSubmit={parseSite}>
                <UInput
                    placeholder="Enter url..."
                    required
                    value={url}
                    type="url"
                    onChange={({ target }) => setUrl(target.value)}
                    trailing={<UButton showLoader type="submit" className="btn-primary">Submit</UButton>}
                />

            </UForm>
            <div className="mt-4">
                <h4><b>Site title: </b><span className="text-secondary">{title}</span></h4>
            </div>
        </div>
    );
};

export default Page;


