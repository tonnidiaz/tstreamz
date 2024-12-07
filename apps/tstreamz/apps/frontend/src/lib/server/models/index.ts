import mn, {  Model, model } from "mongoose";
import { UserSchema, type IUser } from "./user";
export const User: Model<IUser> = mn.models.User || model("User", UserSchema, )
