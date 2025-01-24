import type { IVideo } from "@/lib/interfaces";
import mongoose, { Schema } from "mongoose";

export const TuVidSchema = new Schema<IVideo>({title:{}, thumb:{},side: {}, date: {}, links:{}});
export interface ITuVidModel extends mongoose.Document, mongoose.InferSchemaType<typeof TuVidSchema>{}