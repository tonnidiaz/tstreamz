export interface IMetadataItem {
    title: string;
    description: string;
}
export interface ISocialMetadata extends IMetadataItem {
    images: string;
}
export interface IMetadata extends IMetadataItem {
    url: string;
    favicon: string;
    og: ISocialMetadata & { url: string };
    twitter: ISocialMetadata & {card: string, site: string};
}
