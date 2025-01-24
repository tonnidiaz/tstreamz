import mongoose from "mongoose";
import { TuVidSchema, type ITuVidModel } from "./tu-vid";

export const TuVid: mongoose.Model<ITuVidModel> = mongoose.models.TuVid || mongoose.model("TuVid", TuVidSchema)