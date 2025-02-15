import React, { useState } from "react";

const GooglePreview = ({ title, description, url }) => {
    return (
        <div className="seo-card google">
            <div className="header">
                <br style={{height: 15}}/>
                <h3 className="page-title">{title}</h3>
                <div className="links">
                <div className="flex items-center">
                    <div className="favicon">
                        <img src="/favicon.ico" alt="" />
                    </div>
                    <div>
                        <div className="site">
                            <span>{new URL(url).hostname}</span>
                        </div>
                        <div className="url">
                            <span>{url}</span>
                        </div>
                    </div>
                </div>
            </div>

            
            </div>
            <div className="flex-1 desc" dangerouslySetInnerHTML={{__html: description}}>
            </div>
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
                <span className="host">{ogUrl}</span>
                <h2 className="page-title">{ogTitle}</h2>
                <p>{ogDescription}</p>
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

const MetadataPreviews = ({ metadata, setMetadata }) => {
    return (
        <div className="flex flex-col gap-4">
            <GooglePreview
                title={metadata.title}
                description={metadata.description}
                url={metadata.canonical}
            />
            <FacebookPreview ogTitle={metadata.ogTitle} ogDescription={metadata.ogDescription} ogImage={metadata.ogImage} ogUrl={metadata.ogUrl} />
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
        <div className="p-4 border border-gray-300 rounded-md bg-white">
            <h3 className="text-lg font-bold">Edit Metadata</h3>
            <input
                type="text"
                name="title"
                value={metadata.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full p-2 border rounded-md mb-2"
            />
            <input
                type="text"
                name="description"
                value={metadata.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-2 border rounded-md mb-2"
            />
            <input
                type="text"
                name="ogImage"
                value={metadata.ogImage}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full p-2 border rounded-md"
            />
        </div>
    );
};

const MetadataTool = () => {
    const title =  "Watch the lion king: Mufasa de rock. - Tunedstreamz"
    const desc = `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi veritatis eveniet voluptas nisi nulla pariatur tempore nostrum! Temporibus explicabo exercitationem quia velit quasi quibusdam consectetur quae dolorum sit odio? Unde?`
    const url = "https://www.tstreamz.xyz/movies"
    const [metadata, setMetadata] = useState({
        title,
        description: desc,
        canonical: url,
        url,
        ogTitle: title,
        ogDescription: desc,
        ogImage: "/assets/images/meta-img.jpg",
    });

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <MetadataEditor metadata={metadata} setMetadata={setMetadata} />
            <MetadataPreviews metadata={metadata} setMetadata={setMetadata} />
        </div>
    );
};

export default MetadataTool;
