import mongoose, { Schema, type InferSchemaType, Document, Types } from "mongoose";

const VisitorSchema = new Schema(
    {
        ip: {type: String, required: true},
        visits: {type: Number, default: 0},
        time: {type: Number, default: 0},
        entered_at: {type: Number, default: 0},
    },
    { timestamps: true,}, 
);

export interface IVisitor extends Document, InferSchemaType<typeof VisitorSchema> {}
export { VisitorSchema };


  
  
  
