import { IMetadata, IMetadataItem } from "@/utils/interfaces";
import { isValidURL } from "@cmn/utils/funcs";
import { tuImmer } from "@cmn/utils/funcs4";
import TuModal from "@repo/ui-next/components/TuModal";
import UButton from "@repo/ui-next/components/UButton";
import UDivider from "@repo/ui-next/components/UDivider";
import UFormGroup from "@repo/ui-next/components/UFormGroup";
import UInput from "@repo/ui-next/components/UInput";
import UTextArea from "@repo/ui-next/components/UTextarea";
import React, { useEffect, useState } from "react";
import MetadataEditor from "./MetadataEditor";

const GooglePreview = ({ meta }: { meta: IMetadata }) => {
    return (
        <div className="seo-card w-450px google">
            <div className="header">
                <br style={{ height: 15 }} />
                <h3 className="page-title">
                    {meta.title || `[title goes here]`}
                </h3>
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
                                        : `[url goes here]`}
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
                    __html: meta.description || `[description goes here]`,
                }}
            ></div>
        </div>
    );
};

const FacebookPreview = ({ meta }: { meta: IMetadata["og"] }) => {
    return (
        <div className="seo-card w-450px facebook">
            <div className="h-48 w-ful img">
                {meta.images && isValidURL(meta.url) ? (
                    <img
                        src={meta.images}
                        alt="Preview"
                        className="w-full object-cover"
                    />
                ) : (
                    <p className=" fs-18">[og:image goes here]</p>
                )}
            </div>

            <div className="desc">
                <div className="host">
                    {meta.url?.length && isValidURL(meta.url)
                        ? new URL(meta.url).host
                              .replace("www.", "")
                              .toUpperCase()
                        : `[og:url goes here]`}
                </div>
                <h2 className="page-title">
                    {meta.title || `[og:title goes here]`}
                </h2>
                <p className="p">
                    {meta.description || `[og:description goes here]`}
                </p>
            </div>
        </div>
    );
};

const TwitterPreview = ({ meta }: { meta: IMetadata["twitter"] }) => {
    return (
        <div className="seo-card twitter w-450px">
            <div className="content">
                <div
                    className="img"
                    style={{ backgroundImage: `url("${meta.images}")` }}
                >
                    {!meta.images && "[twitter:image goes here]"}
                </div>

                <div className="desc">
                    <div>
                        <h3 className="page-title">
                            {meta.title || "[twitter:title goes here]"}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WhatsAppPreview = ({ meta }: { meta: IMetadata["og"] }) => {
    return (
        <div className="seo-card w-450px wapp">
            <div className="content">
                <div className="img">
                    {meta.images && isValidURL(meta.images) ? (
                        <img
                            src={meta.images}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                        />
                    ) : (
                        "[og:image goes here]"
                    )}
                </div>
                <div className="info">
                    <h3 className="page-title">
                        {meta.title || "[og:title goes here]"}
                    </h3>
                    <div className="desc">
                        {meta.description || "[og:description goes here]"}
                    </div>
                    <span className="host">
                        {isValidURL(meta.url) ? (
                            <a href={meta.url} target="_blank">
                                {isValidURL(meta.url) && new URL(meta.url).host}
                            </a>
                        ) : (
                            "[og:url hostname goes here"
                        )}
                    </span>
                </div>
            </div>
            <div className="link">
                <span>
                    {meta.url ? (
                        <a href={meta.url} target="_blank">
                            {isValidURL(meta.url) && meta.url}
                        </a>
                    ) : (
                        "[og:url goes here]"
                    )}
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
                <GooglePreview meta={metadata} />
            </div>
            <div>
                <h4>Facebook</h4>
                <FacebookPreview meta={metadata.og} />
            </div>
            <div>
                <h4>Twitter</h4>
                <TwitterPreview meta={metadata.twitter} />
            </div>
            <div>
                <h4>WhatsApp</h4>
                <WhatsAppPreview meta={metadata.og} />
            </div>

            {/* <LinkedInPreview ogTitle={metadata.ogTitle} ogDescription={metadata.ogDescription} ogImage={metadata.ogImage} /> */}
            {/* Add more previews here for Telegram, Slack, Discord, etc. */}
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
    const [sz, setSz] = useState({ w: 0, h: 0 });

    function onWinResize() {
        setSz({ w: window.innerWidth, h: window.innerHeight });
    }

    useEffect(() => {
        onWinResize();
    }, []);
    useEffect(() => {
        window.addEventListener("resize", onWinResize);
        return () => window.removeEventListener("resize", onWinResize);
    }, []);
    return (
        <div
            className={`p-2 md:p4 bg-gray-100 flex justify-center ${sz.w >= 815 && "gap-2"}`}
        >
            {sz.w >= 815 ? (
                <MetadataEditor metadata={metadata} setMetadata={setMetadata} />
            ) : (
                <div>
                    <TuModal
                        toggler={
                            <UButton className="fab rounded-full fs-20 w-40px h-40px btn-primary">
                                <i className="fi fi-sr-pencil"></i>
                            </UButton>
                        }
                    >
                        <MetadataEditor
                            metadata={metadata}
                            setMetadata={setMetadata}
                        />
                    </TuModal>
                </div>
            )}

            <MetadataPreviews metadata={metadata} />
        </div>
    );
};

export default MetadataTool;
