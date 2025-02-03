"use server";

import { JobModel, UserModel } from "@/models";
import { DEV } from "@cmn/utils/bend/consts";
import { clearTerminal, handleErrs, timedLog } from "@cmn/utils/funcs";
import { FlattenMaps } from "mongoose";
import { IJobModel } from "@/models";
import { scrapeJobDetails } from "./scraper";

export const runOnce = async () => {
    const { configDotenv } = await import("dotenv");
    const { connectMongo } = await import("@cmn/utils/bend/funcs");
    configDotenv();
    // if (appStarted) return
    clearTerminal();
    timedLog("[RUN ONCE]\n");
    try {
        // Connect to db
        await connectMongo(DEV, "tu-jobs");
    } catch (err) {
        handleErrs(err);
    } finally {
        // appStarted = true
    }
};

export const getUsers = async () => {
    try {
        const users = await UserModel.find({}).exec();
        return users.map((el) => el.toJSON());
    } catch (err) {
        handleErrs(err);
    }
};

export const getJobById = async (id: string) => {
    try {
        const job = await JobModel.findById(id).exec();
        return {
            title: job.title,
            id: job.id,
            jobId: job.jobId,
            link: job.link,
            posted: job.posted?.toISOString(),
            exp: job.exp?.toISOString(),
        };
    } catch (err) {
        handleErrs(err);
    }
};

export type TJobData  = Awaited<ReturnType<typeof getJobById>>
