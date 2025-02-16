import { IMetadata } from "@/utils/interfaces";
import { isValidURL } from "@cmn/utils/funcs";
import UDivider from "@repo/ui-next/components/UDivider";
import UFormGroup from "@repo/ui-next/components/UFormGroup";
import UInput from "@repo/ui-next/components/UInput";
import UTextArea from "@repo/ui-next/components/UTextarea";
import React, { useState } from "react";

const GooglePreview = ({ title, description, url, canonical, favicon }) => {
    return (
        <div className="seo-card w-450px google">
            <div className="header">
                <br style={{ height: 15 }} />
                <h3 className="page-title">{title || `[title comes here]`}</h3>
                <div className="links">
                    <div className="flex items-center">
                        <div className="favicon">
                            {favicon && (
                                <img src={favicon} alt="site favicon" />
                            )}
                        </div>
                        <div>
                            <div className="site">
                                <span>
                                    {canonical?.length && isValidURL(canonical)
                                        ? new URL(canonical).hostname
                                        : `[url comes here]`}
                                </span>
                            </div>
                            <div className="url">
                                <span>{url}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="flex-1 desc"
                dangerouslySetInnerHTML={{
                    __html: description || `[description comes here]`,
                }}
            ></div>
        </div>
    );
};

const FacebookPreview = ({ ogTitle, ogDescription, ogImage, ogUrl }) => {
    return (
        <div className="seo-card w-450px facebook">
            <div className="h-48 w-ful img">
                {ogImage ? (
                    <img
                        src={ogImage}
                        alt="Preview"
                        className="w-full object-cover"
                    />
                ) : (
                    <p className=" fs-18">[og:image comes here]</p>
                )}
            </div>

            <div className="desc">
                <div className="host">
                    {ogUrl?.length && isValidURL(ogUrl)
                        ? new URL(ogUrl).host.replace("www.", "").toUpperCase()
                        : `[og:url comes here]`}
                </div>
                <h2 className="page-title">
                    {ogTitle || `[og:title comes here]`}
                </h2>
                <p className="p">
                    {ogDescription || `[og:description comes here]`}
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

const WhatsAppPreview = ({ ogTitle, ogDescription, ogImage, ogUrl }) => {
    return (
        <div className="seo-card w-450px wapp">
            <div className="content">
                <div className="img">
                    {ogImage && (
                        <img
                            src={ogImage}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                        />
                    )}
                </div>
                <div className="info">
                    <h3 className="page-title">{ogTitle}</h3>
                    <div className="desc">{ogDescription}</div>
                    <span className="host">
                        <a href={ogUrl} target="_blank">
                            {isValidURL(ogUrl) && new URL(ogUrl).host}
                        </a>
                    </span>
                </div>
            </div>
            <div className="link">
                <span>
                    {" "}
                    <a href={ogUrl} target="_blank">
                        {isValidURL(ogUrl) && ogUrl}
                    </a>
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
                    title={metadata.title}
                    description={metadata.description}
                    url={metadata.url}
                    canonical={metadata.canonical}
                    favicon={metadata.favicon}
                />
            </div>
            <div>
                <h4>Facebook</h4>
                <FacebookPreview
                    ogTitle={metadata.ogTitle}
                    ogDescription={metadata.ogDescription}
                    ogImage={metadata.ogImage}
                    ogUrl={metadata.ogUrl}
                />
            </div>

            {/* <TwitterPreview twitterTitle={metadata.twitterTitle} twitterDescription={metadata.twitterDescription} twitterImage={metadata.twitterImage} /> */}
            <WhatsAppPreview
                ogUrl={metadata.ogUrl}
                ogTitle={metadata.ogTitle}
                ogDescription={metadata.ogDescription}
                ogImage={metadata.ogImage}
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
                    onChange={handleChange}
                    placeholder="Description"
                    style={{ resize: "vertical" }}
                />
            </UFormGroup>
            <UFormGroup label="Page image url">
                <UInput
                    type="text"
                    name="ogImage"
                    className="input-sm"
                    value={metadata.ogImage}
                    onChange={handleChange}
                    placeholder="Image URL"
                />
            </UFormGroup>
            <UDivider className="my-4"/>
            {/* Facebook */}
            <UFormGroup label="Facebook title">
                <UInput
                    type="text"
                    name="ogTitle"
                    value={metadata.ogTitle}
                    onChange={handleChange}
                    placeholder="OG title..."
                    className="input-sm"
                />
            </UFormGroup>
            <UFormGroup label="Facebook description">
                <UTextArea
                    name="ogDescription"
                    value={metadata.ogDescription}
                    onChange={handleChange}
                    placeholder="OG description..."
                    style={{ resize: "vertical" }}
                />
            </UFormGroup>
            <UFormGroup label="Facebook image url">
                <UInput
                    type="text"
                    name="ogImage"
                    className="input-sm"
                    value={metadata.ogImage}
                    onChange={handleChange}
                    placeholder="OG Image URL"
                />
            </UFormGroup>
            <UDivider className="my-4"/>
            {/* Twitter */}
            <UFormGroup label="Twitter title">
                <UInput
                    type="text"
                    name="twitterTitle"
                    value={metadata.twitterTitle}
                    onChange={handleChange}
                    placeholder="Twitter title..."
                    className="input-sm"
                />
            </UFormGroup>
            <UFormGroup label="Twitter description">
                <UTextArea
                    name="twitterDescription"
                    value={metadata.twitterDescription}
                    onChange={handleChange}
                    placeholder="Twitter description..."
                    style={{ resize: "vertical" }}
                />
            </UFormGroup>
            <UFormGroup label="Twitter image url">
                <UInput
                    type="text"
                    name="twitterImage"
                    className="input-sm"
                    value={metadata.twitterImage}
                    onChange={handleChange}
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
