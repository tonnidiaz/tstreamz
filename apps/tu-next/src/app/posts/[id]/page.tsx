import { getPostById } from "@/utils/server/funcs";
import { timedLog } from "@cmn/utils/funcs";
import { Metadata } from "next";
import { cache } from "react";

interface Props {
    params: Promise<{ id: string }>;
}
const getData = cache(async(id: string)=>{
    timedLog("Getting data...\n")
    const data = await getPostById(id)
    return data
})


export const generateMetadata = async ({params}: Props) =>{
    timedLog("[GEN_METADATA] BEGIN")
    const {id} = await params

    const {post, ts} = await getData(id)

    const meta: Metadata = {
        title: post.name,
        description: post.desc
    }
    timedLog("[GEN_METADATA] DONE")
    return meta
}
const page = async ({ params }: Props) => {
    timedLog("[PAGE] BEGIN")
    const {id} = await params

    const {post, ts} = await getData(id)

    return (
        <>
            <div className="p-4">
                <h1 className="title">
                    Post: <span className="text-primary">{post.name}</span>
                </h1>
                <span className="fs-10">{id}</span>
                <p>{post.desc}</p>
            </div>
        </>
    );
};

export default page;
