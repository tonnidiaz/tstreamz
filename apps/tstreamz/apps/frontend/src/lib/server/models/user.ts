import { Schema, type InferSchemaType, Document } from "mongoose";

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
        watchlist: {type: [String], default: []},
        is_pro:{type: Boolean, default: false}
    },
    { timestamps: true }
);

export interface IUser extends Document, InferSchemaType<typeof UserSchema> {}
export { UserSchema };
