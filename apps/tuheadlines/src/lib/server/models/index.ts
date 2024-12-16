import mn, {  Model, model } from "mongoose";
import { HeadlineSchema, type IHeadline } from "./headline";
import { VisitorSchema, type IVisitor } from "./visitor";
export const Headline: Model<IHeadline> = mn.models.Headline || model("Headline", HeadlineSchema, );
export const Visitor: Model<IVisitor> = mn.models.Visitor || model("Visitor", VisitorSchema, );
