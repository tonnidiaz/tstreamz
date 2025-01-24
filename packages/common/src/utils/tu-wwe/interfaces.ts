export type IVideoSide = "all" | "raw" | "smackdown";
export interface IVideo {
    title: string;
    side: IVideoSide;
    thumb: string;
    date: string;
    links: { label: string; url: string }[];
}
