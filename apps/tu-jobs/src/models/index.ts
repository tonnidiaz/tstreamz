import { IJob } from "@/utils/interfaces";
import { Document, InferSchemaType, Model, model, models, Schema } from "mongoose";

const UserSchema = new Schema<{fullname: string; age: number}>({fullname: {}, age: {}})
export interface IUserModel extends Document, InferSchemaType<typeof UserSchema>{}

const JobSchema = new Schema<IJob>({title: {}, jobId: {},link: {},posted: {}, exp: {}, source: {}, location: {}, contract: {}})
export interface IJobModel extends Document, InferSchemaType<typeof JobSchema>{}

export const UserModel : Model<IUserModel> = models.User || model("User", UserSchema)
export const JobModel : Model<IJobModel> = models.Job || model("Job", JobSchema)