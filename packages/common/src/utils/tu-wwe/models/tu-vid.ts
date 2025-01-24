import mongoose, { Schema } from "mongoose";
import { IVideo } from "../interfaces";

export const TuVidSchema = new Schema<IVideo>({title:{}, thumb:{},side: {}, date: {}, links:{}});
export interface ITuVidModel extends mongoose.Document, mongoose.InferSchemaType<typeof TuVidSchema>{}