import mongoose from "mongoose";
import { ITuVidModel, TuVidSchema } from "./tu-vid";
import { createMongoConn } from "@cmn/utils/bend/funcs";
import { config } from "dotenv";
import { DEV } from "@cmn/utils/bend/consts";

config()
// console.log(process.env);
export const db = createMongoConn(DEV, "tu-wwe");
export const TuVid: mongoose.Model<ITuVidModel> = db.models.TuVid || db.model("TuVid", TuVidSchema)