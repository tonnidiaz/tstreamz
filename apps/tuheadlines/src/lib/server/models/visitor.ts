import mongoose, { Schema, type InferSchemaType, Document, Types } from "mongoose";

const VisitorSchema = new Schema(
    {
        ip: {type: String, required: true},
        visits: {type: Number, default: 0},
        time: {type: Number, default: 0},
        entered_at: {type: Number, default: 0},
        left_at: {type: Number, default: 0},
        location: {type: String},
        device: {type: {
            user_agent: String, is_mobile: Boolean, browser: String, platform: String, _id: false
        }},

    },
    { timestamps: true,}, 
);

export interface IVisitor extends Document, InferSchemaType<typeof VisitorSchema> {}
export { VisitorSchema };


  
  
  
