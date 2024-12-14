import { connectMongo } from "@cmn/utils/bend/funcs";
import mongoose, { Schema, type InferSchemaType, Document, Types } from "mongoose";
const Watchlist = {movies: {type: [{}], default: []}, shows: {type: [{}], default: []}}

const UserSchema = new Schema(
    {
        first_name: {
            type: String,
        },

        last_name: {
            type: String,
        },
        otp: { type: Number },
        username: { type: String, unique: true, required: true },
        email_verified: {
            type: Boolean,
            default: false,
        },
        new_email_verified: {
            type: Boolean,
            default: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        new_email: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        watchlist: {type: Watchlist, default: {movies: [], shows: []}},
        is_pro:{type: Boolean, default: false},
        is_admin:{type: Boolean, default: false}
    },
    { timestamps: true,}, 
);

export interface IUser extends Document, InferSchemaType<typeof UserSchema> {}
export { UserSchema };


  
  
  
