
export interface IPaperDocItem { name: string; link: string }
export interface IPaperDoc {paper: IPaperDocItem, memo?: IPaperDocItem}
export interface IPastPaper {
    year: string;
    subject: string;
    papers: {
        date: string;
        docs: IPaperDoc[];
    }[];
}

export interface IParsedPastPaper {
    year: string;
    subjects: IPastPaper[];
}