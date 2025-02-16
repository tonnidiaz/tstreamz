import { IMetadata, IMetadataItem } from "@/utils/interfaces";
import { isValidURL } from "@cmn/utils/funcs";
import { tuImmer } from "@cmn/utils/funcs4";
import UDivider from "@repo/ui-next/components/UDivider";
import UFormGroup from "@repo/ui-next/components/UFormGroup";
import UInput from "@repo/ui-next/components/UInput";
import UTextArea from "@repo/ui-next/components/UTextarea";
import React, { useEffect, useState } from "react";

const GooglePreview = ({meta}: {meta: IMetadata}) => {
    return (
        <div className="seo-card w-450px google">
            <div className="header">
                <br style={{ height: 15 }} />
                <h3 className="page-title">{meta.title || `[title comes here]`}</h3>
                <div className="links">
                    <div className="flex items-center">
                        <div className="favicon">
                            {meta.favicon && (
                                <img src={meta.favicon} alt="site favicon" />
                            )}
                        </div>
                        <div>
                            <div className="site">
                                <span>
                                    {meta.url?.length && isValidURL(meta.url)
                                        ? new URL(meta.url).hostname
                                        : `[url comes here]`}
                                </span>
                            </div>
                            <div className="url">
                                <span>{meta.url}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="flex-1 desc"
                dangerouslySetInnerHTML={{
                    __html: meta.description || `[description comes here]`,
                }}
            ></div>
        </div>
    );
};

const FacebookPreview = ({meta} : {meta: IMetadata['og']}) => {
    return (
        <div className="seo-card w-450px facebook">
            <div className="h-48 w-ful img">
                {meta.image ? (
                    <img
                        src={meta.image}
                        alt="Preview"
                        className="w-full object-cover"
                    />
                ) : (
                    <p className=" fs-18">[og:image comes here]</p>
                )}
            </div>

            <div className="desc">
                <div className="host">
                    {meta.url?.length && isValidURL(meta.url)
                        ? new URL(meta.url).host.replace("www.", "").toUpperCase()
                        : `[og:url comes here]`}
                </div>
                <h2 className="page-title">
                    {meta.title || `[og:title comes here]`}
                </h2>
                <p className="p">
                    {meta.description || `[og:description comes here]`}
                </p>
            </div>
        </div>
    );
};

const TwitterPreview = ({ twitterTitle, twitterDescription, twitterImage }) => {
    return (
        <div className="border border-gray-300 w-[500px] rounded-md bg-white">
            {twitterImage && (
                <img
                    src={twitterImage}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900">
                    {twitterTitle}
                </h3>
                <p className="text-sm text-gray-700">{twitterDescription}</p>
            </div>
        </div>
    );
};

const WhatsAppPreview = ({meta}: {meta: IMetadata['og']}) => {
    return (
        <div className="seo-card w-450px wapp">
            <div className="content">
                <div className="img">
                    {meta.image ? (
                        <img
                            src={meta.image}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                        />
                    ) : '[og:image goes here]'}
                </div>
                <div className="info">
                    <h3 className="page-title">{meta.title || '[og:title goes here]'}</h3>
                    <div className="desc">{meta.description || '[og:description goes here]'}</div>
                    <span className="host">
                        {isValidURL(meta.url) ? <a href={meta.url} target="_blank">
                            {isValidURL(meta.url) && new URL(meta.url).host}
                        </a> : '[og:url hostname goes here'}
                    </span>
                </div>
            </div>
            <div className="link">
                <span>
                    {meta.url ? <a href={meta.url} target="_blank">
                        {isValidURL(meta.url) && meta.url}
                    </a> : '[og:url goes here]'}
                </span>
            </div>
        </div>
    );
};

const LinkedInPreview = ({ ogTitle, ogDescription, ogImage }) => {
    return (
        <div className="border border-gray-300 w-[500px] rounded-md bg-white">
            {ogImage && (
                <img
                    src={ogImage}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900">{ogTitle}</h3>
                <p className="text-sm text-gray-700">{ogDescription}</p>
            </div>
        </div>
    );
};

const MetadataPreviews = ({ metadata }: { metadata: IMetadata }) => {
    return (
        <div className="flex flex-col gap-4 items-center">
            <div>
                <h4>Google</h4>
                <GooglePreview
                    meta={metadata}
                />
            </div>
            <div>
                <h4>Facebook</h4>
                <FacebookPreview meta={metadata.og}
                />
            </div>

            {/* <TwitterPreview twitterTitle={metadata.twitterTitle} twitterDescription={metadata.twitterDescription} twitterImage={metadata.twitterImage} /> */}
            <WhatsAppPreview
                meta={metadata.og}
            />
            {/* <LinkedInPreview ogTitle={metadata.ogTitle} ogDescription={metadata.ogDescription} ogImage={metadata.ogImage} /> */}
            {/* Add more previews here for Telegram, Slack, Discord, etc. */}
        </div>
    );
};

const MetadataEditor = ({ metadata, setMetadata }: {metadata: IMetadata; setMetadata: (m: IMetadata)=> any}) => {
    const handleChange = (e) => {
        setMetadata({ ...metadata, [e.target.name]: e.target.value });
    };

    useEffect(()=>{
        console.log(metadata);
    }, [metadata])
    return (
        <div className="p-4 border border-gray-300 rounded-md bg-white flex-col gap-1">
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
                    onChange={(e)=>setMetadata(tuImmer(metadata, m=>m.description = e.target.value))}
                    placeholder="Description"
                    style={{ resize: "vertical" }}
                />
            </UFormGroup>
            <UDivider className="my-4"/>
            {/* Facebook */}
            <UFormGroup label="Facebook title">
                <UInput
                    type="text"
                    name="ogTitle"
                    value={metadata.og.title}
                    onChange={(e)=>setMetadata(tuImmer(metadata, m=>m.og.title = e.target.value))}
                    placeholder="OG title..."
                    className="input-sm"
                />
            </UFormGroup>
            <UFormGroup label="Facebook description">
                <UTextArea
                    name="ogDescription"
                    value={metadata.og.description}
                    onChange={(val)=>setMetadata(tuImmer(metadata, m=>m.og.description= val))}
                    placeholder="OG description..."
                    style={{ resize: "vertical" }}
                />
            </UFormGroup>
            <UFormGroup label="Facebook image url">
                <UInput
                    type="text"
                    name="ogImage"
                    className="input-sm"
                    value={metadata.og.image}
                    onChange={(e)=>setMetadata(tuImmer(metadata, m=>m.og.image = e.target.value))}
                    placeholder="OG Image URL"
                />
            </UFormGroup>
            <UDivider className="my-4"/>
            {/* Twitter */}
            <UFormGroup label="Twitter title">
                <UInput
                    type="text"
                    name="twitterTitle"
                    value={metadata.twitter.title}
                    onChange={(e)=>setMetadata(tuImmer(metadata, m=>m.twitter.title = e.target.value))}
                    placeholder="Twitter title..."
                    className="input-sm"
                />
            </UFormGroup>
            <UFormGroup label="Twitter description">
                <UTextArea
                    name="twitterDescription"
                    value={metadata.twitter.description}
                    onChange={(e)=>setMetadata(tuImmer(metadata, m=>m.twitter.description = e.target.value))}
                    placeholder="Twitter description..."
                    style={{ resize: "vertical" }}
                />
            </UFormGroup>
            <UFormGroup label="Twitter image url">
                <UInput
                    type="text"
                    name="twitterImage"
                    className="input-sm"
                    value={metadata.twitter.image}
                    onChange={(e)=>setMetadata(tuImmer(metadata, m=>m.twitter.image = e.target.value))}
                    placeholder="Twitter Image URL"
                />
            </UFormGroup>
        </div>
    );
};

const MetadataTool = ({
    metadata,
    setMetadata,
    url,
}: {
    metadata: IMetadata;
    setMetadata: (val: IMetadata) => any;
    url: string;
}) => {
    return (
        <div className="p-4 bg-gray-100 flex gap-2 justify-center">
            <MetadataEditor metadata={metadata} setMetadata={setMetadata} />
            <MetadataPreviews metadata={metadata} />
        </div>
    );
};

export default MetadataTool;
