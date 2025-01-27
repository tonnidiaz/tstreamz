import { showSides } from "./consts";

export type IVideoSide = typeof showSides[number];
export interface IVideo {
    title: string;
    side: IVideoSide;
    thumb: string;
    date: string;
    links: { label: string; url: string }[];
}
