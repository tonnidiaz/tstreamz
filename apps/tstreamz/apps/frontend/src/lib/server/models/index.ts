import mn, {  Model, model } from "mongoose";
import { UserSchema, type IUser } from "./user";
import { VisitorSchema, type IVisitor } from "./visitor";
export const User: Model<IUser> = mn.models.User || model("User", UserSchema, );
export const Visitor: Model<IVisitor> = mn.models.Visitor || model("Visitor", VisitorSchema, );
