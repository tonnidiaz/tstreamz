import { genHtmlMetatags, genNextjsMetatags } from "@/utils/funcs";
import { useTuState } from "@/utils/hooks";
import { IMetadata, IMetadataItem } from "@/utils/interfaces";
import { isValidURL } from "@cmn/utils/funcs";
import { tuImmer } from "@cmn/utils/funcs4";
import TuModal from "@repo/ui-next/components/TuModal";
import UButton from "@repo/ui-next/components/UButton";
import UDivider from "@repo/ui-next/components/UDivider";
import UFormGroup from "@repo/ui-next/components/UFormGroup";
import UInput from "@repo/ui-next/components/UInput";
import UTextArea from "@repo/ui-next/components/UTextarea";
import { showToast } from "@repo/ui/utils/funcs";
import React, { useEffect, useState } from "react";



const MetadataEditor = ({
    metadata,
    setMetadata,
}: {
    metadata: IMetadata;
    setMetadata: (m: IMetadata) => any;
}) => {

    const [metatags, setMetatags] = useState({html: '', nextjs: ''})
    // const [exportModalOpen, setExportModalOpen] = useState(true)
    const exportModalOpen = useTuState(false)
    const format = useTuState<"html" | "nextjs">("html")

    const handleChange = (e) => {
        setMetadata({ ...metadata, [e.target.name]: e.target.value });
    };
    const exportMetatags = () =>{
        console.log('\nExporting metatags...');
        setMetatags({html: genHtmlMetatags(metadata), nextjs: genNextjsMetatags(metadata)});
        // setExportModalOpen(true)
        exportModalOpen.value = true

    }
    useEffect(() => {}, [metadata]);
    return (
        <div className="md:p-4 p-2 border border-gray-300 rounded-md bg-white flex-col gap-1">
            <h3 className="text-lg font-bold mb-3">Edit Metadata</h3>
            <UFormGroup label="Page title">
                <UInput
                    type="text"
                    name="title"
                    value={metadata.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="input-sm"
                />
            </UFormGroup>
            <UFormGroup label="Page description">
                <UTextArea
                    name="description"
                    value={metadata.description}
                    onChange={(val) =>
                        setMetadata(
                            tuImmer(
                                metadata,
                                (m) => (m.description = val)
                            )
                        )
                    }
                    placeholder="Description"
                    style={{ resize: "vertical" }}
                />
            </UFormGroup>
            <UDivider className="my-4" />
            {/* Facebook */}
            <UFormGroup label="Facebook title">
                <UInput
                    type="text"
                    name="ogTitle"
                    value={metadata.og.title}
                    onChange={(e) =>
                        setMetadata(
                            tuImmer(
                                metadata,
                                (m) => (m.og.title = e.target.value)
                            )
                        )
                    }
                    placeholder="OG title..."
                    className="input-sm"
                />
            </UFormGroup>
            <UFormGroup label="Facebook description">
                <UTextArea
                    name="ogDescription"
                    value={metadata.og.description}
                    onChange={(val) =>
                        setMetadata(
                            tuImmer(metadata, (m) => (m.og.description = val))
                        )
                    }
                    placeholder="OG description..."
                    style={{ resize: "vertical" }}
                />
            </UFormGroup>
            <UFormGroup label="Facebook image url">
                <UInput
                    type="text"
                    name="ogImage"
                    className="input-sm"
                    value={metadata.og.images}
                    onChange={(e) =>
                        setMetadata(
                            tuImmer(
                                metadata,
                                (m) => (m.og.images = e.target.value)
                            )
                        )
                    }
                    placeholder="OG Image URL"
                />
            </UFormGroup>
            <UDivider className="my-4" />
            {/* Twitter */}
            <UFormGroup label="Twitter title">
                <UInput
                    type="text"
                    name="twitterTitle"
                    value={metadata.twitter.title}
                    onChange={(e) =>
                        setMetadata(
                            tuImmer(
                                metadata,
                                (m) => (m.twitter.title = e.target.value)
                            )
                        )
                    }
                    placeholder="Twitter title..."
                    className="input-sm"
                />
            </UFormGroup>
            <UFormGroup label="Twitter description">
                <UTextArea
                    name="twitterDescription"
                    value={metadata.twitter.description}
                    onChange={(e) =>
                        setMetadata(
                            tuImmer(
                                metadata,
                                (m) => (m.twitter.description = e)
                            )
                        )
                    }
                    placeholder="Twitter description..."
                    style={{ resize: "vertical" }}
                />
            </UFormGroup>
            <UFormGroup label="Twitter image url">
                <UInput
                    type="text"
                    name="twitterImage"
                    className="input-sm"
                    value={metadata.twitter.images}
                    onChange={(e) =>
                        setMetadata(
                            tuImmer(
                                metadata,
                                (m) => (m.twitter.images = e.target.value)
                            )
                        )
                    }
                    placeholder="Twitter Image URL"
                />
            </UFormGroup>
            <UDivider className="my-3"/>
            <UButton onClick={exportMetatags} className="btn-primary">Export metatags</UButton>
            <TuModal open={exportModalOpen}>
                <h3>Output metatags</h3>
                <UDivider className="mt-2"></UDivider>
                <div className="mt-2">
                    <div className="mb-2 flex-col items-center">
                        <div className="flex gap-2 items-center">
                        <UFormGroup className="flex items-center gap-1 flex-row-reverse" label="HTML">
                            <input value={"html"} onChange={({target})=> format.value = target.value as any} checked={format.value == 'html'} name="format" type="radio" className="radio radio-primary"/>
                        </UFormGroup>
                        <UFormGroup className="flex items-center gap-1 flex-row-reverse"  label="NextJs (app router)">
                            <input value={"nextjs"} onChange={({target})=> format.value = target.value as any}  checked={format.value == 'nextjs'} name="format" type="radio" className="radio radio-primary"/>
                        </UFormGroup>
                        
                    </div>
                    </div>
                    
                    <UTextArea style={{height: "40vh", color: 'green', fontFamily: 'monospace'}} placeholder={`${format.value} metatags...`} readOnly value={metatags[format.value]}/>
                    <UButton onClick={()=>{
                        navigator.clipboard.writeText(metatags[format.value]);
                        showToast({msg: "Metatags copied to clipboard",})
                    }} className="btn-primary"><span><i className="fi fi-sr-copy"></i></span> Copy</UButton>
                </div>
            </TuModal>
        </div>
    );
};

export default MetadataEditor