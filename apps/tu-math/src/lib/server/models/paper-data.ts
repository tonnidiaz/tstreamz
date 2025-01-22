import type { IPastPaper } from "@/lib/interfaces";
import { Document, Schema, Types, type InferSchemaType } from "mongoose";

export const PastPaperSchema = new Schema<IPastPaper>({
    year: {},
    subject: {},
    papers: {},
});

export interface IPastPaperModel
    extends Document,
        InferSchemaType<typeof PastPaperSchema> {}
