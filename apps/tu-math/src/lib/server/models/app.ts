import { Document, Schema, type InferSchemaType } from "mongoose";

export const TuAppSchema = new Schema<{
    /**List of past paper years */
    past_papers?: string[];
}>({past_papers: {
   
}});

export interface ITuAppModel
    extends Document,
        InferSchemaType<typeof TuAppSchema> {}
