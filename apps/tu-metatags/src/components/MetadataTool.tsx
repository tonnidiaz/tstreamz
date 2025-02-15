import { IMetadata } from "@/utils/interfaces";
import UFormGroup from "@repo/ui-next/components/UFormGroup";
import UInput from "@repo/ui-next/components/UInput";
import UTextArea from "@repo/ui-next/components/UTextarea";
import React, { useState } from "react";

const GooglePreview = ({ title, description, url, canonical }) => {
    return (
        <div className="seo-card google">
            <div className="header">
                <br style={{ height: 15 }} />
                <h3 className="page-title">{title}</h3>
                <div className="links">
                    <div className="flex items-center">
                        <div className="favicon">
                            <img src="/favicon.ico" alt="" />
                        </div>
                        <div>
                            <div className="site">
                                <span>{new URL(canonical).hostname}</span>
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
                dangerouslySetInnerHTML={{ __html: description }}
            ></div>
        </div>
    );
};

const FacebookPreview = ({ ogTitle, ogDescription, ogImage, ogUrl }) => {
    return (
        <div className="seo-card facebook">
            <div className="h-48 w-ful img">
                {ogImage && (
                    <img
                        src={ogImage}
                        alt="Preview"
                        className="w-full object-cover"
                    />
                )}
            </div>

            <div className="desc">
                <div className="host">
                    {new URL(ogUrl).host.replace("www.", "").toUpperCase()}
                </div>
                <h2 className="page-title">{ogTitle}</h2>
                <p className="p">{ogDescription}</p>
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

const WhatsAppPreview = ({ ogTitle, ogDescription, ogImage }) => {
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

const MetadataPreviews = ({ metadata } :{metadata: IMetadata}) => {
    return (
        <div className="flex flex-col gap-4 items-center">
            <div>
             <h4>Google</h4>
            <GooglePreview
                title={metadata.title}
                description={metadata.description}
                url={metadata.url}
                canonical={metadata.canonical}
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
            {/* <WhatsAppPreview ogTitle={metadata.ogTitle} ogDescription={metadata.ogDescription} ogImage={metadata.ogImage} /> */}
            {/* <LinkedInPreview ogTitle={metadata.ogTitle} ogDescription={metadata.ogDescription} ogImage={metadata.ogImage} /> */}
            {/* Add more previews here for Telegram, Slack, Discord, etc. */}
        </div>
    );
};

const MetadataEditor = ({ metadata, setMetadata }) => {
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
                {" "}
                <UInput
                    type="text"
                    name="ogImage"
                    className="input-sm"
                    value={metadata.ogImage}
                    onChange={handleChange}
                    placeholder="Image URL"
                />
            </UFormGroup>
        </div>
    );
};

const MetadataTool = ({metadata, setMetadata, url} : {metadata : IMetadata; setMetadata: (val: IMetadata)=>any; url: string}) => {
    

    return (
        <div className="p-4 bg-gray-100 flex gap-2 justify-center">
            <MetadataEditor metadata={metadata} setMetadata={setMetadata} />
            <MetadataPreviews metadata={metadata}/>
        </div>
    );
};

export default MetadataTool;
