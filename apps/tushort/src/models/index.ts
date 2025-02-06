import { Document, InferSchemaType, Model, model, models, Schema } from "mongoose";

const UserSchema = new Schema<{fullname: string; age: number}>({fullname: {}, age: {}})
export interface IUser extends Document, InferSchemaType<typeof UserSchema>{}

export const UserModel : Model<IUser> = models.User || model("User", UserSchema)