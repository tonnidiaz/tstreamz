import { Schema, type InferSchemaType, Document } from "mongoose";

const HeadlineSchema = new Schema(
    {
       title: {type: String, required: true},
       snippet: {type: String},
       link: {type: String, required: true},
       photo_url: {type: String,},
       published_at: {type: String,},
    },
    { timestamps: true,}, 
);

export interface IHeadline extends Document, InferSchemaType<typeof HeadlineSchema> {}
export { HeadlineSchema };


  
  
  
