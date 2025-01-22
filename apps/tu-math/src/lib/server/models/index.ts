import { PastPaperSchema, type IPastPaperModel, } from "./paper-data";
import { TuAppSchema, type ITuAppModel, } from "./app";
import mn from "mongoose"

export const PastPaper: mn.Model<IPastPaperModel> = mn.models.PastPaper || mn.model("PastPaper", PastPaperSchema, );
export const TuApp: mn.Model<ITuAppModel> = mn.models.TuApp || mn.model("TuApp", TuAppSchema, );