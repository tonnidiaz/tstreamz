export interface IMetadataItem {
    title: string;
    description: string;
}
export interface ISocialMetadata extends IMetadataItem {
    image: string;
}
export interface IMetadata extends IMetadataItem {
    url: string;
    favicon: string;
    og: ISocialMetadata & { url: string };
    twitter: ISocialMetadata;
}
